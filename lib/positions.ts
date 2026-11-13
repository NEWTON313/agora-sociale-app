/**
 * Positions documentées des candidats sur les questions de la boussole (lib/boussole.ts).
 * Chaque position renvoie à une mesure déjà recensée dans lib/data.ts : sa source principale est celle de la mesure
 * (aucune position sans source). Une position absente de cette liste = non documentée (écartée du calcul, jamais
 * comptée comme un désaccord). Règle : on n'enregistre que ce que la source dit directement.
 *
 * VALIDATION. Les équipes de campagne ne sont pas sollicitées : une position est établie à partir de sources
 * publiques, dans cet ordre de préférence :
 *   1. « officielle » : le programme ou le site officiel du candidat ou de son parti, consulté directement ;
 *   2. « recoupée »   : au moins deux médias de référence indépendants (domaines différents) disent la même chose ;
 *   3. « unique »     : une seule source de presse — la position est affichée comme « à recouper ».
 * Le niveau est calculé (niveauValidation), jamais saisi à la main.
 */
import { domainePrincipal } from "./sources";

export type Choix = "A" | "B";

/** « officielle » : programme ou site officiel du candidat ou de son parti. « presse » : média de référence. */
export type TypeSource = "officielle" | "presse";

/** Source supplémentaire, indépendante de la source principale, qui confirme la position. */
export interface Recoupement {
  url: string;
  type: TypeSource;
  /** Date de publication (AAAA-MM-JJ, ou AAAA-MM si le jour n'est pas connu). */
  date: string;
  /** Phrase de cette source qui confirme la position. */
  citation?: string;
}

export interface Position {
  candidat: string;
  question: number;
  choix: Choix;
  mesureId: string;
  /** Type de la source principale (celle de la mesure) ; « presse » par défaut. */
  typeSource?: TypeSource;
  /** Date de publication de la source principale (AAAA-MM-JJ ou AAAA-MM). */
  dateSource?: string;
  /** Phrase de la source principale qui établit la position. */
  citation?: string;
  recoupements?: Recoupement[];
}

export type NiveauValidation = "officielle" | "recoupee" | "unique";

/** Niveau de validation d'une position, d'après sa source principale (adresse de la mesure) et ses recoupements. */
export function niveauValidation(position: Position, urlPrincipale: string): NiveauValidation {
  const sources = [{ url: urlPrincipale, type: position.typeSource ?? "presse" }, ...(position.recoupements ?? [])];
  if (sources.some((s) => s.type === "officielle")) return "officielle";
  return new Set(sources.map((s) => domainePrincipal(s.url))).size >= 2 ? "recoupee" : "unique";
}

export const POSITIONS: Position[] = [
  // 1 — Smic
  {
    candidat: "arthaud", question: 1, choix: "A", mesureId: "na-smic-2000",
    dateSource: "2026-09-26",
    citation: "plaidé pour un Smic à 2.200 euros net",
    recoupements: [
      {
        url: "https://www.franceinfo.fr/replay-magazine/franceinfo/l-invite-politique/prix-du-carburant-nathalie-arthaud-porte-parole-de-lutte-ouvriere-souhaite-la-mise-en-place-du-smic-a-2-000-euros-net-par-mois_7978223.html",
        type: "presse", date: "2026-05-22",
        citation: "l'augmentation du SMIC : le SMIC à 2 000 euros nets par mois",
      },
    ],
  },
  {
    candidat: "tondelier", question: 1, choix: "A", mesureId: "mt-smic",
    dateSource: "2026-08-27",
    citation: "les Ecologistes porteront un SMIC à 2 000 euros brut",
    recoupements: [{ url: "https://lcp.fr/actualites/presidentielle-2027-ce-qu-il-faut-retenir-du-premier-debat-entre-les-candidats-440670", type: "presse", date: "2026-08-27", citation: "un Smic à 2.000 euros brut" }],
  },
  {
    candidat: "melenchon", question: 1, choix: "A", mesureId: "jlm-smic-1700",
    dateSource: "2026-11-06",
    citation: "augmenter immédiatement le Smic à 1700 euros nets",
    recoupements: [
      {
        url: "https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2", type: "officielle", date: "2026-11-06",
        citation: "Augmenter immédiatement le SMIC à 1 700 euros net mensuel",
      },
      { url: "https://www.france24.com/fr/france/20261106-france-insoumise-jean-luc-melenchon-presente-programme-presidentielle-2027-fidele-volonte-rupture-lfi", type: "presse", date: "2026-11-06", citation: "hausse du smic à 1 700 euros net" },
    ],
  },
  { candidat: "ruffin", question: 1, choix: "A", mesureId: "frf-smic-1700", dateSource: "2026-11-06" },
  // 2 — fiscalité des entreprises et du capital
  {
    candidat: "melenchon", question: 2, choix: "B", mesureId: "jlm-fiscalite",
    recoupements: [
      {
        url: "https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2", type: "officielle", date: "2026-11-06",
        citation: "Supprimer la flat tax et imposer les revenus du capital comme ceux du travail",
      },
      { url: "https://lcp.fr/actualites/presidentielle-2027-ce-qui-change-dans-le-nouveau-programme-de-jean-luc-melenchon-444841", type: "presse", date: "2026-11-06" },
    ],
  },
  {
    candidat: "glucksmann", question: 2, choix: "B", mesureId: "rg-heritage-salaires",
    recoupements: [
      { url: "https://www.france24.com/fr/france/20260827-premier-d%C3%A9bat-de-la-pr%C3%A9sidentielle-2027-les-principales-propositions-des-candidats", type: "presse", date: "2026-08-27", citation: "chez les grands, les méga-héritiers" },
      { url: "https://lcp.fr/actualites/presidentielle-2027-ce-qu-il-faut-retenir-du-premier-debat-entre-les-candidats-440670", type: "presse", date: "2026-08-27", citation: "taxant davantage les successions" },
    ],
  },
  // 3 — âge légal
  {
    candidat: "melenchon", question: 3, choix: "A", mesureId: "jlm-retraites",
    dateSource: "2026-11-06",
    citation: "droit à la retraite à 60 ans à taux plein pour 40 annuités de cotisations",
    recoupements: [
      {
        url: "https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1", type: "officielle", date: "2026-11-06",
        citation: "abaisser l'âge de départ jusqu'à restaurer le droit à la retraite à 60 ans",
      },
      { url: "https://www.france24.com/fr/france/20261106-france-insoumise-jean-luc-melenchon-presente-programme-presidentielle-2027-fidele-volonte-rupture-lfi", type: "presse", date: "2026-11-06", citation: "restaurer le droit à la retraite à 60 ans à taux plein pour 40 années de cotisation" },
    ],
  },
  {
    candidat: "philippe", question: 3, choix: "B", mesureId: "ep-retraites-65-ans",
    dateSource: "2026-09-29",
    recoupements: [
      {
        url: "https://lcp.fr/actualites/retraites-edouard-philippe-veut-porter-l-age-de-depart-a-65-ans-et-la-duree-de", type: "presse", date: "2026-09-29",
        citation: "Je propose de porter progressivement la durée de cotisation à 45 ans et l'âge de départ à 65 ans",
      },
    ],
  },
  { candidat: "bouamrane", question: 3, choix: "B", mesureId: "kb-retraite-65-ans" },
  // 4 — capitalisation
  {
    candidat: "retailleau", question: 4, choix: "A", mesureId: "br-retraites",
    recoupements: [
      {
        url: "https://www.france24.com/fr/info-en-continu/20260922-retraites-retailleau-veut-instaurer-un-%C3%A2ge-minimal-de-d%C3%A9part-%C3%A0-63-ans-le-taux-plein-%C3%A0-65", type: "presse", date: "2026-09-22",
        citation: "ça représente à peu près un quart, soit 25 à 30% des retraites des jeunes",
      },
    ],
  },
  // 5 — droit du sol
  {
    candidat: "retailleau", question: 5, choix: "A", mesureId: "br-droit-du-sol",
    recoupements: [
      {
        url: "https://la1ere.franceinfo.fr/mayotte/passes-d-armes-entre-le-pen-et-melenchon-le-droit-du-sol-a-mayotte-s-invite-une-nouvelle-fois-dans-la-campagne-presidentielle-1755522.html", type: "presse", date: "2026-11-07",
        citation: "appelait à supprimer le droit du sol en France par référendum",
      },
    ],
  },
  { candidat: "dupont-aignan", question: 5, choix: "A", mesureId: "nda-droit-du-sol" },
  {
    candidat: "le-pen", question: 5, choix: "A", mesureId: "mlp-immigration",
    recoupements: [
      {
        url: "https://www.france24.com/fr/info-en-continu/20260905-en-r%C3%A9visant-la-constitution-par-r%C3%A9f%C3%A9rendum-le-rn-au-pouvoir-ouvrirait-une-crise-majeure", type: "presse", date: "2026-09-05",
        citation: "fin du droit du sol et du regroupement familial",
      },
    ],
  },
  // 6 — quotas
  {
    candidat: "attal", question: 6, choix: "A", mesureId: "ga-immigration",
    recoupements: [
      {
        url: "https://www.france24.com/fr/info-en-continu/20260530-pr%C3%A9sidentielle-en-meeting-attal-vante-sa-force-d-agir-et-expose-sa-promesse-fran%C3%A7aise", type: "presse", date: "2026-05-30",
        citation: "une ambition d'une \"préférence travail\" pour l'immigration, via un système de quotas",
      },
    ],
  },
  // 7 — mineurs délinquants
  {
    candidat: "attal", question: 7, choix: "A", mesureId: "ga-justice-mineurs",
    recoupements: [
      {
        url: "https://lcp.fr/actualites/justice-des-mineurs-gabriel-attal-veut-restaurer-l-autorite-aupres-des-jeunes", type: "presse", date: "2024-11-25",
        citation: "réintroduire une procédure de comparution immédiate",
      },
    ],
  },
  {
    candidat: "retailleau", question: 7, choix: "A", mesureId: "br-majorite-penale",
    recoupements: [
      {
        url: "https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/les-elus-lfi-ont-arme-la-violence-avec-leurs-mots-d-ordre-accuse-le-president-de-lr-bruno-retailleau_8242834.html", type: "presse", date: "2026-10-18",
        citation: "la majorité pénale des mineurs soit à 15 ans, pour faire en sorte qu'on mette des peines minimales",
      },
    ],
  },
  // 10 — régulation de l'installation des médecins
  {
    candidat: "batho", question: 10, choix: "A", mesureId: "db-reguler-installation-medecins",
    dateSource: "2025-04",
    citation: "ce n'est pas la remise en cause de la liberté d'installation, c'est le fait de la réguler",
    recoupements: [
      { url: "https://lcp.fr/actualites/deserts-medicaux-l-assemblee-nationale-vote-en-faveur-d-une-regulation-de-l-installation", type: "presse", date: "2025-04-03" },
    ],
  },
  // 11 — nucléaire
  {
    candidat: "melenchon", question: 11, choix: "B", mesureId: "jlm-nucleaire",
    recoupements: [
      {
        url: "https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3", type: "officielle", date: "2026-11-06",
        citation: "Planifier la fermeture progressive des centrales nucléaires existantes",
      },
      { url: "https://lcp.fr/actualites/presidentielle-2027-ce-qui-change-dans-le-nouveau-programme-de-jean-luc-melenchon-444841", type: "presse", date: "2026-11-06" },
    ],
  },
  // 13 — protection de la production
  {
    candidat: "attal", question: 13, choix: "A", mesureId: "ga-preference-europeenne",
    recoupements: [
      {
        url: "https://www.france24.com/fr/info-en-continu/20260917-gabriel-attal-plaide-pour-des-etats-unis-d-europe-le-projet-d-une-g%C3%A9n%C3%A9ration", type: "presse", date: "2026-09-17",
        citation: "A la préférence nationale de la favorite des sondages, il a opposé une \"préférence européenne\".",
      },
    ],
  },
  {
    candidat: "melenchon", question: 13, choix: "A", mesureId: "jlm-moratoire-libre-echange",
    dateSource: "2026-11-06",
    recoupements: [
      {
        url: "https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre1", type: "officielle", date: "2026-11-06",
        citation: "un protectionnisme écologique et solidaire, avec notamment une taxe kilométrique aux frontières de l'UE",
      },
    ],
  },
  // 15 — RIC
  {
    candidat: "egger", question: 15, choix: "A", mesureId: "ce-ric-pouvoir-maires",
    dateSource: "2026-11-09",
    citation: "veut promouvoir le référendum d'initiative citoyenne (RIC) et donner plus de pouvoir aux maires",
  },
  {
    candidat: "melenchon", question: 15, choix: "A", mesureId: "jlm-ric",
    typeSource: "officielle", dateSource: "2026-11-06",
    citation: "Instaurer le référendum d'initiative citoyenne (RIC)",
  },
  // 16 — proportionnelle
  {
    candidat: "melenchon", question: 16, choix: "A", mesureId: "jlm-proportionnelle-49-3",
    dateSource: "2026-11-06",
    recoupements: [
      {
        url: "https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1", type: "officielle", date: "2026-11-06",
        citation: "Élire l'Assemblée nationale au scrutin proportionnel",
      },
    ],
  },
  // 17 — sortie de l'UE ou de l'euro
  {
    candidat: "asselineau", question: 17, choix: "A", mesureId: "fa-frexit",
    recoupements: [
      {
        url: "https://www.france24.com/fr/info-en-continu/20260519-agression-et-harc%C3%A8lement-sexuels-fran%C3%A7ois-asselineau-renvoy%C3%A9-en-proc%C3%A8s", type: "presse", date: "2026-05-19",
        citation: "Partisan d'une sortie de la France de l'Union européenne, de l'euro et de l'Otan",
      },
    ],
  },
  {
    candidat: "dupont-aignan", question: 17, choix: "A", mesureId: "nda-frexit",
    recoupements: [
      {
        url: "https://www.franceinfo.fr/politique/nicolas-dupont-aignan/je-serai-le-seul-candidat-qui-propose-de-sortir-de-l-union-europeenne-dit-nicolas-dupont-aignan-qui-se-lance-dans-sa-quatrieme-campagne-presidentielle_8201024.html", type: "presse", date: "2026-09-19",
        citation: "Je serai le seul candidat qui propose de sortir de cette prison qu'est l'Union européenne",
      },
    ],
  },
  {
    candidat: "melenchon", question: 17, choix: "B", mesureId: "jlm-europe-nouveaux-traites",
    typeSource: "officielle", dateSource: "2026-11-06",
    citation: "Avec nous, la France ne sortira ni de l'Union, ni de la zone euro",
  },
  // 18 — intégration européenne
  {
    candidat: "attal", question: 18, choix: "A", mesureId: "ga-etats-unis-europe",
    recoupements: [
      {
        url: "https://www.france24.com/fr/info-en-continu/20260917-gabriel-attal-plaide-pour-des-etats-unis-d-europe-le-projet-d-une-g%C3%A9n%C3%A9ration", type: "presse", date: "2026-09-17",
        citation: "c'est une fusion économique et écologique d'abord entre un noyau dur de pays européens",
      },
    ],
  },
  { candidat: "retailleau", question: 18, choix: "B", mesureId: "br-bouclier-constitutionnel" },
  // 20 — service national obligatoire
  {
    candidat: "glucksmann", question: 20, choix: "A", mesureId: "rg-service-civique",
    dateSource: "2026-05-26",
    recoupements: [
      {
        url: "https://www.france24.com/fr/france/20260526-pr%C3%A9sidentielle-2027-rapha%C3%ABl-glucksmann-se-donne-trois-mois-pour-convaincre", type: "presse", date: "2026-05-26",
        citation: "Il propose ainsi l'instauration d'un service civique obligatoire de 10 mois.",
      },
    ],
  },
  {
    candidat: "melenchon", question: 20, choix: "A", mesureId: "jlm-conscription-ecologique",
    recoupements: [{ url: "https://lcp.fr/actualites/presidentielle-2027-ce-qui-change-dans-le-nouveau-programme-de-jean-luc-melenchon-444841", type: "presse", date: "2026-11-06" }],
  },
  // 22 — OTAN
  {
    candidat: "philippe", question: 22, choix: "A", mesureId: "ep-ukraine-otan",
    recoupements: [
      {
        url: "https://www.france24.com/fr/info-en-continu/20260526-le-candidat-%C3%A0-la-pr%C3%A9sidentielle-fran%C3%A7aise-edouard-philippe-rencontre-zelensky-%C3%A0-kiev", type: "presse", date: "2026-05-26",
        citation: "à oeuvrer pour que l'Ukraine puisse entrer dans l'Otan",
      },
    ],
  },
  {
    candidat: "asselineau", question: 22, choix: "B", mesureId: "fa-frexit",
    recoupements: [
      {
        url: "https://www.france24.com/fr/info-en-continu/20260519-agression-et-harc%C3%A8lement-sexuels-fran%C3%A7ois-asselineau-renvoy%C3%A9-en-proc%C3%A8s", type: "presse", date: "2026-05-19",
        citation: "Partisan d'une sortie de la France de l'Union européenne, de l'euro et de l'Otan",
      },
    ],
  },
  { candidat: "dupont-aignan", question: 22, choix: "B", mesureId: "nda-frexit" },
  {
    candidat: "melenchon", question: 22, choix: "B", mesureId: "jlm-otan-commandement-integre",
    dateSource: "2026-11-06",
    recoupements: [
      {
        url: "https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre2", type: "officielle", date: "2026-11-06",
        citation: "Se retirer immédiatement du commandement intégré de l'OTAN puis, par étapes, de l'organisation elle-même",
      },
      { url: "https://www.france24.com/fr/france/20261106-france-insoumise-jean-luc-melenchon-presente-programme-presidentielle-2027-fidele-volonte-rupture-lfi", type: "presse", date: "2026-11-06" },
    ],
  },
];
