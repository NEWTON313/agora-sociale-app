/**
 * Badge typographique d'étiquette politique : même forme, même taille, même couleur pour tous les candidats
 * (aucun logo de tiers, aucune couleur de parti — voir la page méthodologie).
 * Le sigle est dérivé du nom de l'étiquette tel que rapporté par la presse : sigle officiel courant s'il est
 * listé ci-dessous, sinon initiales (nom en plusieurs mots) ou nom en capitales (un seul mot). Une étiquette
 * nouvelle obtient donc automatiquement un badge, sans intervention.
 */
const SIGLES_USUELS: Record<string, string> = {
  "Parti socialiste": "PS",
  "Rassemblement national": "RN",
  "La France insoumise": "LFI",
  "Les Républicains": "LR",
  "Parti communiste français": "PCF",
  "Lutte ouvrière": "LO",
  "NPA-Révolutionnaires": "NPA-R",
  "Debout la France": "DLF",
  "Union populaire républicaine": "UPR",
  "Gauche républicaine et socialiste": "GRS",
  "Place publique": "PP",
  "Apparenté Ensemble pour la République": "EPR",
};

const MOTS_OUTILS = new Set(["le", "la", "les", "l", "de", "du", "des", "d", "et", "pour", "en", "au", "aux"]);

/** Sigle affiché dans le badge, ou null quand l'étiquette n'est pas précisée. */
export function siglePartiDe(parti: string): string | null {
  const nom = parti.trim();
  if (nom === "" || /non précisée|sans étiquette/i.test(nom)) return null;
  if (SIGLES_USUELS[nom]) return SIGLES_USUELS[nom];

  const mots = nom
    .replace(/[!?.]/g, " ")
    .split(/[\s'’]+/)
    .filter((m) => m !== "" && !MOTS_OUTILS.has(m.toLowerCase()));
  if (mots.length === 0) return null;
  if (mots.length === 1) return mots[0].toLocaleUpperCase("fr");
  return mots.map((m) => m[0].normalize("NFD").replace(/[̀-ͯ]/g, "")).join("").toLocaleUpperCase("fr");
}
