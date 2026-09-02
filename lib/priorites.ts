/**
 * MON CHOIX 2027 — "Mes priorités" : score personnalisé pondéré (logique pure, testable)
 * Ne réordonne jamais l'affichage par défaut des candidats (voir méthodologie,
 * garde-fous de neutralité) : c'est une vue optionnelle en plus, pas un verdict.
 */
import type { Candidat, ClasseId, Theme } from "./data";
import { THEMES } from "./data";

export const NIVEAUX_PRIORITE = [0, 1, 2, 3] as const;
export type NiveauPriorite = (typeof NIVEAUX_PRIORITE)[number];

export const LABELS_PRIORITE: Record<NiveauPriorite, string> = {
  0: "Pas prioritaire",
  1: "Peu prioritaire",
  2: "Important",
  3: "Très important",
};

export type PoidsThemes = Record<Theme, NiveauPriorite>;

export function poidsThemesParDefaut(): PoidsThemes {
  return Object.fromEntries(THEMES.map((t) => [t, 0])) as PoidsThemes;
}

export interface ScorePersonnalise {
  /** null = non calculable (aucun thème pondéré couvert par une mesure de ce candidat) — jamais affiché comme 0. */
  scoreGlobal: number | null;
  /** Nombre de thèmes pondérés (poids > 0) où ce candidat a au moins une mesure. */
  themesCouverts: number;
  /** Nombre de thèmes que l'utilisateur a marqués comme prioritaires (poids > 0). */
  themesPonderes: number;
  /** Nombre total de thèmes existants, pour donner un dénominateur de référence. */
  themesTotal: number;
}

export function calculerScorePersonnalise(
  candidat: Candidat,
  classeActive: ClasseId,
  poids: PoidsThemes
): ScorePersonnalise {
  const themesPonderes = (Object.keys(poids) as Theme[]).filter((t) => poids[t] > 0);

  let sommePonderee = 0;
  let sommePoids = 0;
  let themesCouverts = 0;

  for (const theme of themesPonderes) {
    const mesuresDuTheme = candidat.mesures.filter((m) => m.theme === theme);
    if (mesuresDuTheme.length === 0) continue;
    themesCouverts++;
    const scoreTheme =
      mesuresDuTheme.reduce((acc, m) => acc + m.impactParClasse[classeActive].score, 0) / mesuresDuTheme.length;
    sommePonderee += scoreTheme * poids[theme];
    sommePoids += poids[theme];
  }

  return {
    scoreGlobal: sommePoids === 0 ? null : sommePonderee / sommePoids,
    themesCouverts,
    themesPonderes: themesPonderes.length,
    themesTotal: THEMES.length,
  };
}

/**
 * Tri stable et explicite (jamais l'ordre par défaut) : les candidats sans score
 * calculable restent toujours en fin de liste, jamais traités comme un score de 0.
 * À égalité de score, on retombe sur l'ordre alphabétique du nom pour un résultat
 * reproductible plutôt que dépendant du moteur JS.
 */
export function trierParScorePersonnalise(
  candidats: Candidat[],
  resultats: Map<string, ScorePersonnalise>
): Candidat[] {
  return [...candidats].sort((a, b) => {
    const scoreA = resultats.get(a.id)?.scoreGlobal ?? null;
    const scoreB = resultats.get(b.id)?.scoreGlobal ?? null;
    if (scoreA === null && scoreB === null) return a.nom.localeCompare(b.nom);
    if (scoreA === null) return 1;
    if (scoreB === null) return -1;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.nom.localeCompare(b.nom);
  });
}
