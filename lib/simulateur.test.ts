import { describe, it, expect } from "vitest";
import {
  calculerUC,
  estimerPercentile,
  classerProfil,
  trouverBaremeRetraite,
  type ProfilSimulateur,
} from "./simulateur";

function profil(overrides: Partial<ProfilSimulateur> = {}): ProfilSimulateur {
  return {
    revenuNetAnnuelMenage: 20000,
    nbAdultes: 1,
    nbEnfants14Plus: 0,
    nbEnfantsMoins14: 0,
    statutActivite: "emploi_salarie",
    ...overrides,
  };
}

describe("calculerUC", () => {
  it("compte 1 UC pour un adulte seul", () => {
    expect(calculerUC(1, 0, 0)).toBe(1);
  });

  it("traite 0 adulte comme 1 (foyer par défaut)", () => {
    expect(calculerUC(0, 0, 0)).toBe(1);
  });

  it("ajoute 0,5 par adulte supplémentaire", () => {
    expect(calculerUC(2, 0, 0)).toBe(1.5);
  });

  it("ajoute 0,5 par enfant de 14 ans ou plus", () => {
    expect(calculerUC(1, 1, 0)).toBe(1.5);
  });

  it("ajoute 0,3 par enfant de moins de 14 ans", () => {
    expect(calculerUC(1, 0, 1)).toBeCloseTo(1.3);
  });

  it("cumule correctement un foyer nombreux", () => {
    // 2 adultes + 1 enfant 14+ + 2 enfants <14 = 1 + 0.5 + 0.5 + 0.6
    expect(calculerUC(2, 1, 2)).toBeCloseTo(2.6);
  });
});

describe("estimerPercentile", () => {
  it("renvoie 0 pour un niveau de vie nul ou négatif", () => {
    expect(estimerPercentile(0)).toBe(0);
    expect(estimerPercentile(-500)).toBe(0);
  });

  it("renvoie 100 au-delà du dernier point de la table", () => {
    expect(estimerPercentile(500000)).toBe(100);
  });

  it("retombe exactement sur un décile connu (D3 = seuil populaires)", () => {
    expect(estimerPercentile(20980)).toBe(30);
  });

  it("retombe exactement sur un décile connu (D8 = seuil moyennes)", () => {
    expect(estimerPercentile(38780)).toBe(80);
  });

  it("interpole linéairement entre deux déciles", () => {
    // Exactement à mi-chemin entre D1 (13970) et D2 (17700) → percentile 15
    expect(estimerPercentile((13970 + 17700) / 2)).toBe(15);
  });
});

describe("classerProfil — classification par revenu", () => {
  it("classe en populaires sous le seuil D3", () => {
    const r = classerProfil(profil({ revenuNetAnnuelMenage: 15000 }));
    expect(r.classeRevenuSecondaire).toBe("populaires");
    expect(r.classePrincipale).toBe("populaires");
  });

  it("classe en moyennes entre D3 et D8", () => {
    const r = classerProfil(profil({ revenuNetAnnuelMenage: 25000 }));
    expect(r.classeRevenuSecondaire).toBe("moyennes");
    expect(r.classePrincipale).toBe("moyennes");
  });

  it("classe en aisées au-delà de D8", () => {
    const r = classerProfil(profil({ revenuNetAnnuelMenage: 50000 }));
    expect(r.classeRevenuSecondaire).toBe("aisees");
    expect(r.classePrincipale).toBe("aisees");
  });
});

describe("classerProfil — ajustement patrimoine", () => {
  it("reclasse moyennes → aisées si le patrimoine net atteint 500 000 €", () => {
    const r = classerProfil(profil({ revenuNetAnnuelMenage: 25000, patrimoineNet: 600000 }));
    expect(r.bumpPatrimoine).toBe(true);
    expect(r.classeRevenuSecondaire).toBe("aisees");
  });

  it("ne reclasse pas juste en dessous du seuil de patrimoine", () => {
    const r = classerProfil(profil({ revenuNetAnnuelMenage: 25000, patrimoineNet: 499999 }));
    expect(r.bumpPatrimoine).toBe(false);
    expect(r.classeRevenuSecondaire).toBe("moyennes");
  });

  it("ne s'applique pas à un profil populaires même avec un gros patrimoine", () => {
    // Le bump ne part que de "moyennes" — un revenu populaires n'est jamais reclassé par le patrimoine.
    const r = classerProfil(profil({ revenuNetAnnuelMenage: 15000, patrimoineNet: 2000000 }));
    expect(r.bumpPatrimoine).toBe(false);
    expect(r.classeRevenuSecondaire).toBe("populaires");
  });
});

describe("classerProfil — priorité retraités & inactifs", () => {
  const statutsInactifs: ProfilSimulateur["statutActivite"][] = [
    "retraite",
    "chomage",
    "etudiant",
    "autre_inactif",
  ];

  for (const statut of statutsInactifs) {
    it(`bascule la classe principale en "retraites" pour le statut "${statut}", quel que soit le revenu`, () => {
      const r = classerProfil(profil({ revenuNetAnnuelMenage: 50000, statutActivite: statut }));
      expect(r.estRetraiteOuInactif).toBe(true);
      expect(r.classePrincipale).toBe("retraites");
      // Le niveau de vie réel reste accessible en info secondaire.
      expect(r.classeRevenuSecondaire).toBe("aisees");
    });
  }

  it("ne bascule pas pour un salarié ou un indépendant", () => {
    expect(classerProfil(profil({ statutActivite: "emploi_salarie" })).estRetraiteOuInactif).toBe(false);
    expect(classerProfil(profil({ statutActivite: "independant" })).estRetraiteOuInactif).toBe(false);
  });
});

describe("trouverBaremeRetraite", () => {
  it("renvoie null sans année de naissance", () => {
    expect(trouverBaremeRetraite(null)).toBeNull();
    expect(trouverBaremeRetraite(undefined)).toBeNull();
  });

  it("génération ≤1960 : barème définitif à 62 ans", () => {
    const r = trouverBaremeRetraite(1959);
    expect(r).toMatchObject({ ageLegal: "62 ans", trimestres: 168, statut: "definitif" });
  });

  it("génération 1964-1968 : barème gelé par la LFSS 2026", () => {
    const r = trouverBaremeRetraite(1964);
    expect(r?.statut).toBe("gele");
  });

  it("génération 1965 : dépend du trimestre de naissance (q1 vs q2-q4)", () => {
    const q1 = trouverBaremeRetraite(1965, "q1");
    const q2_4 = trouverBaremeRetraite(1965, "q2_4");
    expect(q1).toMatchObject({ ageLegal: "62 ans et 9 mois", trimestres: 170 });
    expect(q2_4).toMatchObject({ ageLegal: "63 ans", trimestres: 171 });
  });

  it("génération 1965 sans trimestre précisé retombe sur q2-q4 par défaut", () => {
    expect(trouverBaremeRetraite(1965)).toMatchObject({ ageLegal: "63 ans" });
  });

  it("génération ≥1969 : calendrier incertain, enjeu de l'élection 2027", () => {
    const r = trouverBaremeRetraite(1969);
    expect(r).toMatchObject({ ageLegal: "64 ans", trimestres: 172, statut: "incertain" });
    expect(trouverBaremeRetraite(1990)?.statut).toBe("incertain");
  });
});

describe("classerProfil — repères jeunesse", () => {
  const anneeCourante = new Date().getFullYear();

  it("aucun repère sans année de naissance", () => {
    const r = classerProfil(profil({ anneeNaissance: null }));
    expect(r.reperesJeunesse).toEqual([]);
  });

  it("mineur·e salarié·e de moins de 17 ans : abattement Smic à 80 %", () => {
    const r = classerProfil(
      profil({ anneeNaissance: anneeCourante - 16, statutActivite: "emploi_salarie" })
    );
    expect(r.reperesJeunesse).toHaveLength(1);
    expect(r.reperesJeunesse[0].texte).toContain("80 %");
  });

  it("mineur·e salarié·e de 17 ans : abattement Smic à 90 %", () => {
    const r = classerProfil(
      profil({ anneeNaissance: anneeCourante - 17, statutActivite: "emploi_salarie" })
    );
    expect(r.reperesJeunesse[0].texte).toContain("90 %");
  });

  it("majeur·e salarié·e : pas de repère Smic jeunes", () => {
    const r = classerProfil(
      profil({ anneeNaissance: anneeCourante - 18, statutActivite: "emploi_salarie" })
    );
    expect(r.reperesJeunesse).toEqual([]);
  });

  it("18-24 ans au chômage : repère sur la condition d'âge du RSA", () => {
    const r = classerProfil(profil({ anneeNaissance: anneeCourante - 20, statutActivite: "chomage" }));
    expect(r.reperesJeunesse.some((repere) => repere.titre.includes("RSA"))).toBe(true);
  });

  it("18-24 ans inactif (hors chômage/étude) : même repère RSA", () => {
    const r = classerProfil(
      profil({ anneeNaissance: anneeCourante - 20, statutActivite: "autre_inactif" })
    );
    expect(r.reperesJeunesse.some((repere) => repere.titre.includes("RSA"))).toBe(true);
  });

  it("25 ans et plus : plus de repère RSA jeunesse", () => {
    const r = classerProfil(profil({ anneeNaissance: anneeCourante - 25, statutActivite: "chomage" }));
    expect(r.reperesJeunesse).toEqual([]);
  });

  it("18-24 ans en emploi : pas de repère RSA (condition de statut non remplie)", () => {
    const r = classerProfil(
      profil({ anneeNaissance: anneeCourante - 20, statutActivite: "emploi_salarie" })
    );
    expect(r.reperesJeunesse).toEqual([]);
  });
});
