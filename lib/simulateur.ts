/**
 * MON CHOIX 2027 — Simulateur de classement (logique pure, testable)
 * Source des seuils : Insee, "Distribution des niveaux de vie", données 2024,
 * publication du 09/07/2026. https://www.insee.fr/fr/statistiques/2416808
 * ⚠️ À mettre à jour chaque année (généralement en juillet).
 */
import type { ClasseId } from "./data";

export const SEUILS_NIVEAU_DE_VIE = {
  anneeSource: 2024,
  dateMaj: "2026-07-09",
  points: [
    { percentile: 0, valeur: 0 },
    { percentile: 10, valeur: 13970 },
    { percentile: 20, valeur: 17700 },
    { percentile: 30, valeur: 20980 },
    { percentile: 40, valeur: 23880 },
    { percentile: 50, valeur: 26740 },
    { percentile: 60, valeur: 29880 },
    { percentile: 70, valeur: 33680 },
    { percentile: 80, valeur: 38780 },
    { percentile: 90, valeur: 48580 },
    { percentile: 95, valeur: 61220 },
    { percentile: 100, valeur: 61220 * 1.8 },
  ],
} as const;

export const SEUILS_CLASSIFICATION = {
  populairesMax: 20980,
  moyennesMax: 38780,
  patrimoineBumpAisees: 500000,
};

const STATUTS_RETRAITES_INACTIFS = ["retraite", "chomage", "etudiant", "autre_inactif"] as const;
export type StatutActivite = "emploi_salarie" | "independant" | (typeof STATUTS_RETRAITES_INACTIFS)[number];

/**
 * ---------------------------------------------------------------
 * BARÈME RETRAITE — âge légal et durée de cotisation par génération
 * Source : Service-public.fr / DILA (Premier ministre), « Suspension
 * de la réforme des retraites : qui est concerné ? », 27/02/2026,
 * appliquant la loi n° 2025-1403 du 30/12/2025 (LFSS 2026, art. 105)
 * au calendrier de la loi n° 2023-270 du 14/04/2023.
 * ⚠️ Simplifié (catégorie générale / régime général uniquement).
 * ⚠️ Générations 1969+ : calendrier provisoire, tranché au plus tard
 * en 2028 — directement lié à l'élection de 2027. À réviser à chaque
 * loi de financement de la Sécurité sociale.
 * ---------------------------------------------------------------
 */
export type StatutBareme = "definitif" | "gele" | "incertain";
export type TrimestreNaissance = "q1" | "q2_4";

export interface RepereRetraite {
  ageLegal: string;
  trimestres: number;
  statut: StatutBareme;
  note?: string;
}

const BAREME_RETRAITE: Record<number, RepereRetraite | { quarterDependant: true; q1: RepereRetraite; q2_4: RepereRetraite }> = {
  1961: { ageLegal: "62 ans et 3 mois", trimestres: 169, statut: "definitif", note: "62 ans pour les personnes nées avant le 1er septembre 1961" },
  1962: { ageLegal: "62 ans et 6 mois", trimestres: 169, statut: "definitif" },
  1963: { ageLegal: "62 ans et 9 mois", trimestres: 170, statut: "definitif" },
  1964: { ageLegal: "62 ans et 9 mois", trimestres: 170, statut: "gele", note: "Gelé par la suspension LFSS 2026 : la réforme 2023 prévoyait 63 ans et 171 trimestres." },
  1965: {
    quarterDependant: true,
    q1: { ageLegal: "62 ans et 9 mois", trimestres: 170, statut: "gele", note: "Gelé par la suspension LFSS 2026 : la réforme 2023 prévoyait 63 ans et 3 mois et 172 trimestres." },
    q2_4: { ageLegal: "63 ans", trimestres: 171, statut: "gele", note: "Gelé par la suspension LFSS 2026 : la réforme 2023 prévoyait 63 ans et 3 mois et 172 trimestres." },
  },
  1966: { ageLegal: "63 ans et 3 mois", trimestres: 172, statut: "gele", note: "Gelé par la suspension LFSS 2026 : la réforme 2023 prévoyait 63 ans et 6 mois." },
  1967: { ageLegal: "63 ans et 6 mois", trimestres: 172, statut: "gele", note: "Gelé par la suspension LFSS 2026 : la réforme 2023 prévoyait 63 ans et 9 mois." },
  1968: { ageLegal: "63 ans et 9 mois", trimestres: 172, statut: "gele", note: "Gelé par la suspension LFSS 2026 : la réforme 2023 prévoyait 64 ans." },
};

export function trouverBaremeRetraite(
  anneeNaissance: number | null | undefined,
  trimestreNaissance?: TrimestreNaissance
): RepereRetraite | null {
  if (!anneeNaissance) return null;
  if (anneeNaissance <= 1960) return { ageLegal: "62 ans", trimestres: 168, statut: "definitif" };
  if (anneeNaissance >= 1969) {
    return {
      ageLegal: "64 ans",
      trimestres: 172,
      statut: "incertain",
      note: "Calendrier provisoire de la réforme 2023 : la suspension s'arrête le 1er janvier 2028, sauf nouvelle loi. C'est directement un enjeu de l'élection de 2027.",
    };
  }
  const entree = BAREME_RETRAITE[anneeNaissance];
  if (!entree) return null;
  if ("quarterDependant" in entree) {
    return trimestreNaissance === "q1" ? entree.q1 : entree.q2_4;
  }
  return entree;
}

export interface ProfilSimulateur {
  revenuNetAnnuelMenage: number;
  nbAdultes: number;
  nbEnfants14Plus: number;
  nbEnfantsMoins14: number;
  statutActivite: StatutActivite;
  patrimoineNet?: number;
  anneeNaissance?: number | null;
  trimestreNaissance?: TrimestreNaissance;
}

/**
 * ---------------------------------------------------------------
 * REPÈRES JEUNESSE — Smic minoré et accès au RSA selon l'âge
 * Sources : Code du travail art. D. 3231-3 s. (barème Urssaf/DGT au
 * 1er juin 2026) ; Code de l'action sociale et des familles
 * art. L262-2 s. (montant Caf au 1er avril 2026). Voir la fiche
 * /methodologie/jeunesse pour le détail et les arguments du débat.
 * Âge approximatif (année courante - année de naissance) : suffisant
 * pour orienter, pas pour un calcul de droits individuel.
 * ---------------------------------------------------------------
 */
export interface RepereJeunesse {
  titre: string;
  texte: string;
}

function determinerReperesJeunesse(
  anneeNaissance: number | null | undefined,
  statutActivite: StatutActivite
): RepereJeunesse[] {
  if (!anneeNaissance) return [];
  const age = new Date().getFullYear() - anneeNaissance;
  const reperes: RepereJeunesse[] = [];

  if (age >= 0 && age < 18 && statutActivite === "emploi_salarie") {
    const taux = age < 17 ? "80 %" : "90 %";
    const montant = age < 17 ? "9,85 €" : "11,08 €";
    reperes.push({
      titre: "Smic jeunes : un abattement possible tant que vous êtes mineur·e",
      texte: `À votre âge, un employeur peut légalement vous payer ${taux} du Smic (${montant} brut/heure) tant que vous n'avez pas 6 mois de pratique professionnelle dans la branche — mais rien ne l'y oblige.`,
    });
  }

  if (age >= 18 && age < 25 && (statutActivite === "chomage" || statutActivite === "autre_inactif")) {
    reperes.push({
      titre: "RSA : une condition d'âge qui vous concerne directement",
      texte: "Le RSA classique n'est accessible qu'à partir de 25 ans. Avant cet âge, il faut être parent isolé ou enceinte (sans condition d'activité), ou justifier d'au moins 3 214 heures travaillées sur les 3 dernières années (« RSA jeune actif »).",
    });
  }

  return reperes;
}

export interface ResultatClassement {
  uc: number;
  niveauDeVie: number;
  percentile: number;
  classePrincipale: ClasseId;
  classeRevenuSecondaire: ClasseId;
  estRetraiteOuInactif: boolean;
  bumpPatrimoine: boolean;
  repereRetraite: RepereRetraite | null;
  reperesJeunesse: RepereJeunesse[];
}

export function calculerUC(nbAdultes: number, nbEnfants14Plus: number, nbEnfantsMoins14: number): number {
  const adultes = Math.max(1, nbAdultes || 1);
  return 1 + (adultes - 1) * 0.5 + (nbEnfants14Plus || 0) * 0.5 + (nbEnfantsMoins14 || 0) * 0.3;
}

export function estimerPercentile(valeur: number): number {
  const pts = SEUILS_NIVEAU_DE_VIE.points;
  if (valeur <= pts[0].valeur) return 0;
  for (let i = 1; i < pts.length; i++) {
    if (valeur <= pts[i].valeur) {
      const a = pts[i - 1];
      const b = pts[i];
      const ratio = (valeur - a.valeur) / (b.valeur - a.valeur);
      return Math.round(a.percentile + ratio * (b.percentile - a.percentile));
    }
  }
  return 100;
}

export function classerProfil(profil: ProfilSimulateur): ResultatClassement {
  const uc = calculerUC(profil.nbAdultes, profil.nbEnfants14Plus, profil.nbEnfantsMoins14);
  const niveauDeVie = (profil.revenuNetAnnuelMenage || 0) / uc;
  const percentile = estimerPercentile(niveauDeVie);

  const estRetraiteOuInactif = (STATUTS_RETRAITES_INACTIFS as readonly string[]).includes(profil.statutActivite);

  let classeRevenu: ClasseId;
  if (niveauDeVie < SEUILS_CLASSIFICATION.populairesMax) classeRevenu = "populaires";
  else if (niveauDeVie < SEUILS_CLASSIFICATION.moyennesMax) classeRevenu = "moyennes";
  else classeRevenu = "aisees";

  const bumpPatrimoine =
    classeRevenu === "moyennes" && (profil.patrimoineNet || 0) >= SEUILS_CLASSIFICATION.patrimoineBumpAisees;
  if (bumpPatrimoine) classeRevenu = "aisees";

  const classePrincipale: ClasseId = estRetraiteOuInactif ? "retraites" : classeRevenu;

  return {
    uc,
    niveauDeVie: Math.round(niveauDeVie),
    percentile,
    classePrincipale,
    classeRevenuSecondaire: classeRevenu,
    estRetraiteOuInactif,
    bumpPatrimoine,
    repereRetraite: trouverBaremeRetraite(profil.anneeNaissance, profil.trimestreNaissance),
    reperesJeunesse: determinerReperesJeunesse(profil.anneeNaissance, profil.statutActivite),
  };
}
