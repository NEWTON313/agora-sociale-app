import { describe, it, expect } from "vitest";
import { decoderPartage, encoderPartage, themesPrioritaires } from "./partage";
import { poidsThemesParDefaut } from "./priorites";
import { THEMES } from "./data";

function poidsAvec(niveaux: Record<number, 0 | 1 | 2 | 3>) {
  const poids = poidsThemesParDefaut();
  for (const [i, n] of Object.entries(niveaux)) poids[THEMES[Number(i)]] = n;
  return poids;
}

describe("encoderPartage / decoderPartage", () => {
  it("fait l'aller-retour sans perte", () => {
    const poids = poidsAvec({ 0: 3, 1: 2, 5: 1 });
    const qs = new URLSearchParams(encoderPartage("moyennes", poids));
    expect(decoderPartage({ classe: qs.get("classe"), p: qs.get("p") })).toEqual({ classe: "moyennes", poids });
  });

  it("encode un chiffre par thème dans l'ordre de THEMES", () => {
    expect(encoderPartage("aisees", poidsAvec({ 0: 3, 8: 1 }))).toBe("classe=aisees&p=300000001");
  });

  it("rejette une catégorie inconnue ou absente", () => {
    expect(decoderPartage({ classe: "riches", p: "300000000" })).toBeNull();
    expect(decoderPartage({ p: "300000000" })).toBeNull();
  });

  it("rejette une longueur incorrecte", () => {
    expect(decoderPartage({ classe: "moyennes", p: "3000" })).toBeNull();
    expect(decoderPartage({ classe: "moyennes", p: "3000000000" })).toBeNull();
    expect(decoderPartage({ classe: "moyennes" })).toBeNull();
  });

  it("rejette les niveaux hors 0-3 et les caractères non numériques", () => {
    expect(decoderPartage({ classe: "moyennes", p: "400000000" })).toBeNull();
    expect(decoderPartage({ classe: "moyennes", p: "3a0000000" })).toBeNull();
    expect(decoderPartage({ classe: "moyennes", p: "3.0000000" })).toBeNull();
  });

  it("rejette un résultat sans aucune priorité (rien à calculer)", () => {
    expect(decoderPartage({ classe: "moyennes", p: "000000000" })).toBeNull();
  });
});

describe("themesPrioritaires", () => {
  it("trie par niveau décroissant puis ordre des thèmes, et plafonne", () => {
    const poids = poidsAvec({ 0: 1, 1: 3, 2: 2, 3: 3, 4: 2 });
    expect(themesPrioritaires(poids, 3)).toEqual([THEMES[1], THEMES[3], THEMES[2]]);
  });

  it("ignore les thèmes à 0", () => {
    expect(themesPrioritaires(poidsAvec({ 4: 1 }))).toEqual([THEMES[4]]);
    expect(themesPrioritaires(poidsThemesParDefaut())).toEqual([]);
  });
});
