import { describe, it, expect } from "vitest";
import { CANDIDATS } from "./data";
import { POSITIONS } from "./positions";
import { QUESTIONS, SEUIL_COUVERTURE, calculerProximite, classerBoussole, type Reponses } from "./boussole";

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

  it("les questions sont numérotées 1..N sans trou", () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual(QUESTIONS.map((_, i) => i + 1));
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

  it("classe par proximité décroissante, égalités par ordre alphabétique", () => {
    const { classes } = classerBoussole(rep({ 3: "A", 11: "B", 20: "A", 5: "B", 7: "B", 4: "B", 18: "A", 6: "B", 13: "B" }));
    for (let i = 1; i < classes.length; i++) {
      const [a, b] = [classes[i - 1], classes[i]];
      expect(a.score! >= b.score!).toBe(true);
      if (a.score === b.score) expect(a.candidat.id.localeCompare(b.candidat.id, "fr") <= 0).toBe(true);
    }
  });
});
