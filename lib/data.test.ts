import { describe, it, expect } from "vitest";
import { CANDIDATS, CANDIDATS_ALPHABETIQUE, CLASSES_SOCIALES, THEMES } from "./data";

describe("intégrité des données candidats", () => {
  it("chaque candidat a un identifiant unique en minuscules (nom de famille), un nom et un parti", () => {
    const ids = CANDIDATS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of CANDIDATS) {
      expect(c.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(c.nom.trim()).not.toBe("");
      expect(c.parti.trim()).not.toBe("");
      expect(Array.isArray(c.mesures)).toBe(true);
    }
  });

  it("chaque mesure est complète : thème connu, source, 4 catégories, scores de -2 à 2, angle mort", () => {
    const idsMesures = new Set<string>();
    for (const c of CANDIDATS) {
      for (const m of c.mesures) {
        expect(idsMesures.has(m.id), `id de mesure en double : ${m.id}`).toBe(false);
        idsMesures.add(m.id);
        expect(THEMES as readonly string[]).toContain(m.theme);
        expect(m.sourceOfficielle).toMatch(/^https?:\/\//);
        for (const classe of CLASSES_SOCIALES) {
          const impact = m.impactParClasse[classe.id];
          expect(impact, `${m.id} sans impact pour ${classe.id}`).toBeDefined();
          expect(impact.score).toBeGreaterThanOrEqual(-2);
          expect(impact.score).toBeLessThanOrEqual(2);
          expect(impact.angleMort.trim(), `${m.id} sans angle mort pour ${classe.id}`).not.toBe("");
        }
      }
    }
  });
});

describe("ordre alphabétique (équité entre candidats)", () => {
  it("contient tous les candidats, une seule fois, triés par identifiant", () => {
    expect(CANDIDATS_ALPHABETIQUE).toHaveLength(CANDIDATS.length);
    const ids = CANDIDATS_ALPHABETIQUE.map((c) => c.id);
    expect([...ids].sort((a, b) => a.localeCompare(b, "fr"))).toEqual(ids);
  });
});
