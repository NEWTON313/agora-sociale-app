/**
 * MON CHOIX 2027 — Partage d'un résultat (logique pure, testable)
 * Un résultat partagé ne contient QUE la catégorie sociale et les priorités par thème :
 * jamais le revenu, la composition du foyer, l'âge ni le patrimoine saisis dans le simulateur.
 * Les priorités sont encodées dans l'ordre de `THEMES` (un chiffre 0-3 par thème) : si la
 * taxonomie des thèmes change un jour, les anciens liens partagés changeraient de sens.
 */
import { CLASSES_SOCIALES, THEMES, type ClasseId, type Theme } from "./data";
import { NIVEAUX_PRIORITE, poidsThemesParDefaut, type NiveauPriorite, type PoidsThemes } from "./priorites";

export interface ResultatPartage {
  classe: ClasseId;
  poids: PoidsThemes;
}

export function encoderPartage(classe: ClasseId, poids: PoidsThemes): string {
  const p = THEMES.map((t) => poids[t]).join("");
  return `classe=${classe}&p=${p}`;
}

export function decoderPartage(entree: { classe?: string | null; p?: string | null }): ResultatPartage | null {
  const classe = CLASSES_SOCIALES.find((c) => c.id === entree.classe)?.id;
  const p = entree.p;
  if (!classe || typeof p !== "string" || p.length !== THEMES.length) return null;

  const poids = poidsThemesParDefaut();
  for (let i = 0; i < THEMES.length; i++) {
    const n = Number(p[i]);
    if (!Number.isInteger(n) || !(NIVEAUX_PRIORITE as readonly number[]).includes(n)) return null;
    poids[THEMES[i]] = n as NiveauPriorite;
  }

  // Sans aucune priorité, aucun score n'est calculable : pas de résultat à partager.
  if (!THEMES.some((t) => poids[t] > 0)) return null;
  return { classe, poids };
}

/** Thèmes les plus importants pour le visiteur : niveau décroissant, puis ordre des thèmes. */
export function themesPrioritaires(poids: PoidsThemes, max = 3): Theme[] {
  return THEMES.map((t, i) => ({ t, i, n: poids[t] }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || a.i - b.i)
    .slice(0, max)
    .map((x) => x.t);
}
