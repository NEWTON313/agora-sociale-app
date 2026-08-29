import { describe, it, expect } from "vitest";
import {
  poidsThemesParDefaut,
  calculerScorePersonnalise,
  trierParScorePersonnalise,
  type PoidsThemes,
} from "./priorites";
import { THEMES, type Candidat, type ImpactClasse, type Theme } from "./data";

function impact(score: ImpactClasse["score"]): ImpactClasse {
  return { score, avantages: [], risques: [], angleMort: "" };
}

function mesure(theme: Theme, score: ImpactClasse["score"], id = `${theme}-${score}`) {
  return {
    id,
    theme,
    titre: "Mesure de test",
    resumeOfficiel: "",
    sourceOfficielle: "https://example.com",
    niveauConfiance: "confirme" as const,
    impactParClasse: {
      populaires: impact(score),
      moyennes: impact(score),
      aisees: impact(score),
      retraites: impact(score),
    },
  };
}

function candidat(nom: string, mesures: ReturnType<typeof mesure>[]): Candidat {
  return { id: nom.toLowerCase(), nom, parti: "Parti test", mesures };
}

function poids(overrides: Partial<PoidsThemes>): PoidsThemes {
  return { ...poidsThemesParDefaut(), ...overrides };
}

describe("poidsThemesParDefaut", () => {
  it("met tous les thèmes à 0", () => {
    const p = poidsThemesParDefaut();
    expect(Object.keys(p)).toHaveLength(THEMES.length);
    expect(Object.values(p).every((v) => v === 0)).toBe(true);
  });
});

describe("calculerScorePersonnalise", () => {
  it("renvoie null si aucun thème n'est pondéré", () => {
    const c = candidat("Alice", [mesure("Pouvoir d'achat et économie", 2)]);
    const r = calculerScorePersonnalise(c, "populaires", poidsThemesParDefaut());
    expect(r.scoreGlobal).toBeNull();
    expect(r.themesPonderes).toBe(0);
  });

  it("renvoie null si les thèmes pondérés ne sont couverts par aucune mesure du candidat", () => {
    const c = candidat("Alice", [mesure("Pouvoir d'achat et économie", 2)]);
    const r = calculerScorePersonnalise(c, "populaires", poids({ "Sécurité et justice": 3 }));
    expect(r.scoreGlobal).toBeNull();
    expect(r.themesCouverts).toBe(0);
    expect(r.themesPonderes).toBe(1);
  });

  it("un seul thème couvert renvoie le score brut de la mesure", () => {
    const c = candidat("Alice", [mesure("Écologie et énergie", 1)]);
    const r = calculerScorePersonnalise(c, "moyennes", poids({ "Écologie et énergie": 2 }));
    expect(r.scoreGlobal).toBe(1);
    expect(r.themesCouverts).toBe(1);
  });

  it("poids uniformes avec couverture totale équivaut à une moyenne simple", () => {
    const c = candidat("Alice", [mesure("Pouvoir d'achat et économie", 2), mesure("Écologie et énergie", -2)]);
    const p = poids({ "Pouvoir d'achat et économie": 3, "Écologie et énergie": 3 });
    const r = calculerScorePersonnalise(c, "populaires", p);
    expect(r.scoreGlobal).toBe(0); // (2*3 + -2*3) / (3+3) = 0, identique à la moyenne simple (2 + -2) / 2
  });

  it("pondère bien selon l'importance relative des thèmes", () => {
    const c = candidat("Alice", [mesure("Pouvoir d'achat et économie", 2), mesure("Écologie et énergie", -2)]);
    // Pouvoir d'achat 3x plus important que écologie : (2*3 + -2*1) / 4 = 1
    const p = poids({ "Pouvoir d'achat et économie": 3, "Écologie et énergie": 1 });
    const r = calculerScorePersonnalise(c, "populaires", p);
    expect(r.scoreGlobal).toBe(1);
  });

  it("moyenne les scores si un candidat a deux mesures sur le même thème", () => {
    const c = candidat("Alice", [
      mesure("Pouvoir d'achat et économie", 2, "m1"),
      mesure("Pouvoir d'achat et économie", 0, "m2"),
    ]);
    const r = calculerScorePersonnalise(c, "populaires", poids({ "Pouvoir d'achat et économie": 1 }));
    expect(r.scoreGlobal).toBe(1); // (2+0)/2 = 1
    expect(r.themesCouverts).toBe(1);
  });

  it("le score change selon la classe active", () => {
    const m = {
      id: "m1",
      theme: "Services publics" as Theme,
      titre: "t",
      resumeOfficiel: "",
      sourceOfficielle: "https://example.com",
      niveauConfiance: "confirme" as const,
      impactParClasse: {
        populaires: impact(2),
        moyennes: impact(0),
        aisees: impact(-2),
        retraites: impact(1),
      },
    };
    const c = candidat("Alice", [m]);
    const p = poids({ "Services publics": 1 });
    expect(calculerScorePersonnalise(c, "populaires", p).scoreGlobal).toBe(2);
    expect(calculerScorePersonnalise(c, "aisees", p).scoreGlobal).toBe(-2);
  });
});

describe("trierParScorePersonnalise", () => {
  it("place toujours les scores non calculables en fin de liste", () => {
    const alice = candidat("Alice", [mesure("Pouvoir d'achat et économie", 2)]);
    const bob = candidat("Bob", []); // aucune mesure, jamais couvert
    const resultats = new Map([
      [alice.id, { scoreGlobal: 1, themesCouverts: 1, themesPonderes: 1, themesTotal: 9 }],
      [bob.id, { scoreGlobal: null, themesCouverts: 0, themesPonderes: 1, themesTotal: 9 }],
    ]);
    const tries = trierParScorePersonnalise([bob, alice], resultats);
    expect(tries.map((c) => c.nom)).toEqual(["Alice", "Bob"]);
  });

  it("trie par score décroissant", () => {
    const alice = candidat("Alice", []);
    const bob = candidat("Bob", []);
    const resultats = new Map([
      [alice.id, { scoreGlobal: -1, themesCouverts: 1, themesPonderes: 1, themesTotal: 9 }],
      [bob.id, { scoreGlobal: 1.5, themesCouverts: 1, themesPonderes: 1, themesTotal: 9 }],
    ]);
    const tries = trierParScorePersonnalise([alice, bob], resultats);
    expect(tries.map((c) => c.nom)).toEqual(["Bob", "Alice"]);
  });

  it("retombe sur l'ordre alphabétique en cas d'égalité", () => {
    const zoe = candidat("Zoé", []);
    const adam = candidat("Adam", []);
    const resultats = new Map([
      [zoe.id, { scoreGlobal: 1, themesCouverts: 1, themesPonderes: 1, themesTotal: 9 }],
      [adam.id, { scoreGlobal: 1, themesCouverts: 1, themesPonderes: 1, themesTotal: 9 }],
    ]);
    const tries = trierParScorePersonnalise([zoe, adam], resultats);
    expect(tries.map((c) => c.nom)).toEqual(["Adam", "Zoé"]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const alice = candidat("Alice", []);
    const bob = candidat("Bob", []);
    const original = [bob, alice];
    const resultats = new Map([
      [alice.id, { scoreGlobal: 2, themesCouverts: 1, themesPonderes: 1, themesTotal: 9 }],
      [bob.id, { scoreGlobal: -2, themesCouverts: 1, themesPonderes: 1, themesTotal: 9 }],
    ]);
    trierParScorePersonnalise(original, resultats);
    expect(original.map((c) => c.nom)).toEqual(["Bob", "Alice"]);
  });
});
