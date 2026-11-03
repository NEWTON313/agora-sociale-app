/**
 * MON CHOIX 2027 — Boussole des candidats (conception : docs/boussole-conception.md).
 * Chaque question oppose deux propositions symétriques (A / B). La proximité d'un candidat avec la personne
 * n'est calculée que sur les questions où sa position est DOCUMENTÉE ; une position non documentée est écartée,
 * jamais comptée comme un désaccord.
 */
import { CANDIDATS, type Candidat } from "./data";
import { POSITIONS, type Choix } from "./positions";

export interface Question {
  id: number;
  theme: string;
  a: string;
  b: string;
}

export const QUESTIONS: Question[] = [
  { id: 1, theme: "Pouvoir d'achat et économie", a: "Relever fortement le Smic par la loi", b: "Laisser les salaires évoluer par la négociation, sans hausse légale forte du Smic" },
  { id: 2, theme: "Pouvoir d'achat et économie", a: "Baisser les impôts sur les entreprises et le capital pour encourager l'investissement", b: "Maintenir ou augmenter les impôts sur les plus hauts revenus et patrimoines pour financer la dépense publique" },
  { id: 3, theme: "Retraites et modèle social", a: "Revenir à un âge légal de départ plus bas qu'aujourd'hui", b: "Maintenir l'âge légal actuel ou le repousser, pour équilibrer le système" },
  { id: 4, theme: "Retraites et modèle social", a: "Introduire une part de retraite par capitalisation", b: "Conserver un système entièrement par répartition" },
  { id: 5, theme: "Immigration et intégration", a: "Restreindre ou supprimer le droit du sol", b: "Maintenir le droit du sol actuel" },
  { id: 6, theme: "Immigration et intégration", a: "Fixer des quotas annuels d'immigration, votés par le Parlement", b: "Ne pas fixer de plafond chiffré d'entrées" },
  { id: 7, theme: "Sécurité et justice", a: "Durcir les sanctions et accélérer les procédures pour les mineurs délinquants", b: "Privilégier l'éducation et la prévention pour les mineurs délinquants" },
  { id: 8, theme: "Sécurité et justice", a: "Construire davantage de places de prison", b: "Développer les peines alternatives à la prison" },
  { id: 9, theme: "Services publics", a: "Réduire le nombre de fonctionnaires et la dépense publique", b: "Recruter dans l'hôpital, l'école et les services publics, quitte à augmenter la dépense" },
  { id: 10, theme: "Services publics", a: "Réguler l'installation des médecins pour garantir l'accès aux soins", b: "Favoriser l'installation par des incitations, sans contrainte" },
  { id: 11, theme: "Écologie et énergie", a: "Développer le nucléaire en priorité", b: "Sortir progressivement du nucléaire au profit des énergies renouvelables" },
  { id: 12, theme: "Écologie et énergie", a: "Imposer des normes écologiques plus contraignantes", b: "Privilégier l'incitation et l'innovation plutôt que de nouvelles contraintes" },
  { id: 13, theme: "Souveraineté et industrie", a: "Protéger la production nationale (droits de douane, préférence nationale ou européenne)", b: "Favoriser le libre-échange et la concurrence internationale" },
  { id: 14, theme: "Souveraineté et industrie", a: "Placer des secteurs stratégiques sous contrôle public", b: "Laisser le secteur privé les gérer, sous régulation" },
  { id: 15, theme: "Institutions et démocratie", a: "Instaurer un référendum d'initiative citoyenne", b: "Conserver la démocratie représentative, sans RIC" },
  { id: 16, theme: "Institutions et démocratie", a: "Introduire une part de proportionnelle aux législatives", b: "Conserver le scrutin majoritaire" },
  { id: 17, theme: "Europe et géopolitique", a: "Sortir de l'Union européenne ou de l'euro", b: "Rester dans l'Union européenne et l'euro" },
  { id: 18, theme: "Europe et géopolitique", a: "Renforcer l'intégration européenne (budget commun, compétences partagées)", b: "Redonner des compétences aux États, sans nouvelle intégration" },
  { id: 19, theme: "Éducation et jeunesse", a: "Donner plus d'autonomie aux établissements scolaires (recrutement, organisation)", b: "Maintenir un cadre national identique pour tous les établissements" },
  { id: 20, theme: "Éducation et jeunesse", a: "Instaurer un service national obligatoire pour les jeunes", b: "Conserver un engagement uniquement volontaire" },
  { id: 21, theme: "Défense", a: "Augmenter fortement le budget de la défense", b: "Maintenir l'effort de défense actuel, ou le réduire au profit d'autres priorités" },
  { id: 22, theme: "Défense", a: "Rester membre de l'OTAN", b: "Quitter l'OTAN ou son commandement intégré" },
];

/** Nombre minimal de questions répondues ET documentées pour qu'un candidat soit classé. */
export const SEUIL_COUVERTURE = 3;

export type Importance = 1 | 2 | 3;
export type Reponses = Record<number, { choix: Choix | null; poids: Importance }>;

export interface DetailQuestion {
  question: number;
  accord: boolean;
  choixCandidat: Choix;
  source: string;
  titreMesure: string;
}

export interface Proximite {
  candidat: Candidat;
  /** De -1 (opposé sur tout) à +1 (d'accord sur tout) ; null si aucune question documentée. */
  score: number | null;
  accords: number;
  desaccords: number;
  /** Questions répondues où la position du candidat est documentée. */
  documentees: number;
  /** Questions auxquelles la personne a répondu (A ou B). */
  repondues: number;
  classe: boolean;
  details: DetailQuestion[];
}

function mesureDe(candidat: Candidat, mesureId: string) {
  return candidat.mesures.find((m) => m.id === mesureId);
}

export function calculerProximite(candidat: Candidat, reponses: Reponses): Proximite {
  const repondues = QUESTIONS.filter((q) => reponses[q.id]?.choix);
  let somme = 0;
  let sommePoids = 0;
  let accords = 0;
  let desaccords = 0;
  const details: DetailQuestion[] = [];

  for (const q of repondues) {
    const pos = POSITIONS.find((p) => p.candidat === candidat.id && p.question === q.id);
    const mesure = pos ? mesureDe(candidat, pos.mesureId) : undefined;
    if (!pos || !mesure) continue; // non documentée : écartée, jamais un désaccord
    const { choix, poids } = reponses[q.id];
    const accord = pos.choix === choix;
    somme += accord ? poids : -poids;
    sommePoids += poids;
    if (accord) accords++;
    else desaccords++;
    details.push({ question: q.id, accord, choixCandidat: pos.choix, source: mesure.sourceOfficielle, titreMesure: mesure.titre });
  }

  const documentees = accords + desaccords;
  return {
    candidat,
    score: sommePoids === 0 ? null : somme / sommePoids,
    accords,
    desaccords,
    documentees,
    repondues: repondues.length,
    classe: documentees >= SEUIL_COUVERTURE,
    details,
  };
}

/**
 * Classe tous les candidats : ceux dont la couverture suffit, par proximité décroissante (égalités : ordre
 * alphabétique), puis les autres — listés à part, jamais présentés comme un mauvais score.
 */
export function classerBoussole(reponses: Reponses, candidats: Candidat[] = CANDIDATS) {
  const tous = candidats.map((c) => calculerProximite(c, reponses));
  const parNom = (a: Proximite, b: Proximite) => a.candidat.id.localeCompare(b.candidat.id, "fr");
  const classes = tous.filter((p) => p.classe).sort((a, b) => (b.score! - a.score!) || parNom(a, b));
  const autres = tous.filter((p) => !p.classe).sort(parNom);
  return { classes, autres };
}
