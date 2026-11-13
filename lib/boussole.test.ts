import { describe, it, expect } from "vitest";
import { CANDIDATS } from "./data";
import { POSITIONS, niveauValidation, type Position } from "./positions";
import { domainePrincipal } from "./sources";
import { K_PRUDENCE, QUESTIONS, SEUIL_COUVERTURE, calculerProximite, classerBoussole, poidsThemesDepuisBoussole, type Reponses } from "./boussole";

const rep = (r: Record<number, "A" | "B">, poids = 2): Reponses =>
  Object.fromEntries(Object.entries(r).map(([q, choix]) => [Number(q), { choix, poids: poids as 1 | 2 | 3 }]));

describe("intégrité des positions", () => {
  it("chaque position renvoie à une question existante et à une mesure du bon candidat (donc sourcée)", () => {
    const ids = new Set(QUESTIONS.map((q) => q.id));
    const vues = new Set<string>();
    for (const p of POSITIONS) {
      const cle = `${p.candidat}/${p.question}`;
      expect(vues.has(cle), `position en double : ${cle}`).toBe(false);
      vues.add(cle);
      expect(ids.has(p.question), `question inconnue ${p.question}`).toBe(true);
      const c = CANDIDATS.find((x) => x.id === p.candidat);
      expect(c, `candidat inconnu ${p.candidat}`).toBeDefined();
      const m = c!.mesures.find((x) => x.id === p.mesureId);
      expect(m, `mesure introuvable ${p.candidat}/${p.mesureId}`).toBeDefined();
      expect(m!.sourceOfficielle).toMatch(/^https?:\/\//);
    }
  });

  it("citations, dates et recoupements bien formés ; un recoupement vient d'un autre domaine que la source principale", () => {
    const date = /^\d{4}-\d{2}(-\d{2})?$/;
    for (const p of POSITIONS) {
      const cle = `${p.candidat}/${p.question}`;
      const principale = CANDIDATS.find((c) => c.id === p.candidat)!.mesures.find((m) => m.id === p.mesureId)!.sourceOfficielle;
      if (p.dateSource) expect(p.dateSource, cle).toMatch(date);
      if (p.citation !== undefined) expect(p.citation.trim().length, `citation vide : ${cle}`).toBeGreaterThan(10);
      const domaines = new Set([domainePrincipal(principale)]);
      for (const r of p.recoupements ?? []) {
        expect(r.url, cle).toMatch(/^https:\/\//);
        expect(r.date, cle).toMatch(date);
        expect(domaines.has(domainePrincipal(r.url)), `recoupement non indépendant : ${cle} (${r.url})`).toBe(false);
        domaines.add(domainePrincipal(r.url));
      }
    }
  });

  it("les questions sont numérotées 1..N sans trou", () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual(QUESTIONS.map((_, i) => i + 1));
  });
});

describe("niveau de validation d'une position", () => {
  const base: Position = { candidat: "x", question: 1, choix: "A", mesureId: "m" };
  const presse = "https://www.franceinfo.fr/article.html";

  it("une seule source de presse : à recouper", () => {
    expect(niveauValidation(base, presse)).toBe("unique");
  });

  it("deux médias de domaines différents : recoupée ; deux pages du même média : toujours unique", () => {
    const lcp = { url: "https://lcp.fr/actualites/x", type: "presse" as const, date: "2026-11-06" };
    const regions = { url: "https://france3-regions.franceinfo.fr/y", type: "presse" as const, date: "2026-11-06" };
    expect(niveauValidation({ ...base, recoupements: [lcp] }, presse)).toBe("recoupee");
    expect(niveauValidation({ ...base, recoupements: [regions] }, presse)).toBe("unique");
  });

  it("une source officielle (principale ou en recoupement) suffit", () => {
    expect(niveauValidation({ ...base, typeSource: "officielle" }, "https://parti.example/programme")).toBe("officielle");
    const officielle = { url: "https://parti.example/programme", type: "officielle" as const, date: "2026-11" };
    expect(niveauValidation({ ...base, recoupements: [officielle] }, presse)).toBe("officielle");
  });
});

describe("calcul de proximité", () => {
  const melenchon = CANDIDATS.find((c) => c.id === "melenchon")!;

  it("accord complet = +1, désaccord complet = -1", () => {
    // Mélenchon : Q3 A, Q11 B, Q20 A
    expect(calculerProximite(melenchon, rep({ 3: "A", 11: "B", 20: "A" })).score).toBe(1);
    expect(calculerProximite(melenchon, rep({ 3: "B", 11: "A", 20: "B" })).score).toBe(-1);
  });

  it("pondère par l'importance", () => {
    const r: Reponses = { 3: { choix: "A", poids: 3 }, 11: { choix: "A", poids: 1 } }; // accord (3) puis désaccord (1)
    expect(calculerProximite(melenchon, r).score).toBe((3 - 1) / 4);
  });

  it("écarte une position non documentée : jamais un désaccord", () => {
    const p = calculerProximite(melenchon, rep({ 3: "A", 8: "A", 21: "B" })); // 8 et 21 non documentées
    expect(p.documentees).toBe(1);
    expect(p.repondues).toBe(3);
    expect(p.score).toBe(1);
  });

  it("score nul (null) quand aucune question répondue n'est documentée", () => {
    expect(calculerProximite(melenchon, rep({ 8: "A" })).score).toBeNull();
    expect(calculerProximite(melenchon, {}).score).toBeNull();
  });

  it("un candidat sous le seuil de couverture n'est pas classé mais reste listé", () => {
    const { classes, autres } = classerBoussole(rep({ 5: "A", 3: "A" })); // aucune couverture >= seuil pour la plupart
    expect(classes.every((p) => p.documentees >= SEUIL_COUVERTURE)).toBe(true);
    expect(classes.length + autres.length).toBe(CANDIDATS.length);
  });

  it("l'indice ramène l'accord vers zéro quand peu de questions sont documentées", () => {
    // 3 accords d'importance 2 : accord brut +1, indice 6 / (6 + K)
    const p = calculerProximite(melenchon, rep({ 3: "A", 11: "B", 20: "A" }));
    expect(p.score).toBe(1);
    expect(p.indice).toBeCloseTo(6 / (6 + K_PRUDENCE));
    expect(calculerProximite(melenchon, {}).indice).toBeNull();
  });

  it("à accord comparable, plus de questions documentées donne un indice plus élevé (3 sur 3 ne bat plus 7 sur 8)", () => {
    const indice = (accords: number, desaccords: number) => ((accords - desaccords) * 2) / ((accords + desaccords) * 2 + K_PRUDENCE);
    expect(indice(7, 1)).toBeGreaterThan(indice(3, 0));
    expect(indice(3, 0)).toBeGreaterThan(indice(2, 1));
  });

  it("classe par indice de proximité décroissant, égalités par ordre alphabétique", () => {
    const { classes } = classerBoussole(rep({ 3: "A", 11: "B", 20: "A", 5: "B", 7: "B", 4: "B", 18: "A", 6: "B", 13: "B" }));
    for (let i = 1; i < classes.length; i++) {
      const [a, b] = [classes[i - 1], classes[i]];
      expect(a.indice! >= b.indice!).toBe(true);
      if (a.indice === b.indice) expect(a.candidat.id.localeCompare(b.candidat.id, "fr") <= 0).toBe(true);
    }
  });

  it("chaque détail porte sa source principale et son niveau de validation", () => {
    const p = calculerProximite(melenchon, rep({ 3: "A" }));
    expect(p.details).toHaveLength(1);
    expect(p.details[0].sources[0].url).toMatch(/^https?:\/\//);
    expect(["officielle", "recoupee", "unique"]).toContain(p.details[0].validation);
  });
});

describe("priorités déduites de la boussole", () => {
  it("retient l'importance la plus forte par thème, 0 sans réponse, et ignore les thèmes propres à la boussole", () => {
    const r: Reponses = {
      1: { choix: "A", poids: 1 }, // Pouvoir d'achat
      2: { choix: "B", poids: 3 }, // Pouvoir d'achat (plus fort)
      3: { choix: "A", poids: 2 }, // Retraites
      4: { choix: null, poids: 3 }, // sans avis : ignorée
      19: { choix: "A", poids: 3 }, // Éducation : pas un thème du score économique
    };
    const poids = poidsThemesDepuisBoussole(r);
    expect(poids["Pouvoir d'achat et économie"]).toBe(3);
    expect(poids["Retraites et modèle social"]).toBe(2);
    expect(poids["Immigration et intégration"]).toBe(0);
    expect(Object.values(poids).filter((n) => n > 0)).toHaveLength(2);
  });
});
