/**
 * L'AGORA SOCIALE — Modèle de données
 * ⚠️ AVERTISSEMENT MÉTHODOLOGIQUE — voir AVIS_DONNEES_REELLES ci-dessous.
 * Aucune liste de candidats officielle n'existe à ce jour (28/08/2026) ;
 * les parrainages ne seront validés qu'au plus tard le 12/03/2027. Seuls
 * des candidats déjà officiellement déclarés sont inclus, avec un champ
 * `niveauConfiance` par mesure ("confirme" = rapporté par un média
 * reconnu ou position historique documentée ; "annonce" = déclaration
 * publique sans détail chiffré à ce stade). Remplacer par un chargement
 * CMS/JSON versionné avant toute mise en production à grande échelle.
 */

export type ClasseId = "populaires" | "moyennes" | "aisees" | "retraites";

export interface ClasseSociale {
  id: ClasseId;
  nom: string;
  description: string;
  couleurVar: string;     // classe Tailwind (texte/bordure), ex: "populaires"
  couleurFondVar: string; // classe Tailwind (fond clair), ex: "populaires-bg"
}

export const CLASSES_SOCIALES: ClasseSociale[] = [
  {
    id: "populaires",
    nom: "Classes populaires",
    description: "Salariés modestes, employés, ouvriers, travailleurs précaires",
    couleurVar: "populaires",
    couleurFondVar: "populaires-bg",
  },
  {
    id: "moyennes",
    nom: "Classes moyennes",
    description: "Classes moyennes inf. et sup., artisans, commerçants, professions intermédiaires",
    couleurVar: "moyennes",
    couleurFondVar: "moyennes-bg",
  },
  {
    id: "aisees",
    nom: "Classes aisées",
    description: "Cadres dirigeants, professions libérales, hauts revenus, gros patrimoines",
    couleurVar: "aisees",
    couleurFondVar: "aisees-bg",
  },
  {
    id: "retraites",
    nom: "Retraités & inactifs",
    description: "Pensions, pouvoir d'achat des retraités, dépenses de santé",
    couleurVar: "retraites",
    couleurFondVar: "retraites-bg",
  },
];

export const THEMES = ["Pouvoir d'achat", "Fiscalité", "Travail & emploi", "Services publics"] as const;
export type Theme = (typeof THEMES)[number];

export interface ImpactClasse {
  score: -2 | -1 | 0 | 1 | 2;
  avantages: string[];
  risques: string[];
  angleMort: string;
}

export type NiveauConfiance = "confirme" | "annonce";

export interface Mesure {
  id: string;
  theme: Theme;
  titre: string;
  resumeOfficiel: string;
  sourceOfficielle: string;
  niveauConfiance: NiveauConfiance;
  noteConfiance?: string;
  impactParClasse: Record<ClasseId, ImpactClasse>;
}

export interface Candidat {
  id: string;
  nom: string;
  parti: string;
  mesures: Mesure[];
}

export interface AvisDonnees {
  dateMaj: string;
  texte: string;
}

export const AVIS_DONNEES_REELLES: AvisDonnees = {
  dateMaj: "2026-08-28",
  texte:
    "Liste partielle et provisoire : aucune candidature n'est encore officiellement validée par le Conseil constitutionnel (parrainages attendus au plus tard le 12/03/2027). La primaire du Parti socialiste (11-18/10/2026) n'a pas eu lieu ; les écologistes n'ont pas encore de candidat déclaré. La candidature de Marine Le Pen dépend d'un pourvoi en cassation en cours. Chaque mesure indique sa source et son niveau de confiance.",
};

export const CANDIDATS: Candidat[] = [
  {
    id: "melenchon",
    nom: "Jean-Luc Mélenchon",
    parti: "La France insoumise",
    mesures: [
      {
        id: "jlm-retraites",
        theme: "Pouvoir d'achat",
        titre: "Retour de la retraite à 60 ans avec 40 annuités de cotisation",
        resumeOfficiel:
          "Mesure phare reconduite depuis les campagnes 2012, 2017 et 2022 : abroger le report de l'âge légal et revenir à un départ à 60 ans pour une carrière complète de 40 ans, avec alignement des petites pensions sur un Smic revalorisé.",
        sourceOfficielle: "https://fr.wikipedia.org/wiki/%C3%89lection_pr%C3%A9sidentielle_fran%C3%A7aise_de_2027",
        niveauConfiance: "confirme",
        noteConfiance: "Position historique de LFI, répétée et documentée sur trois campagnes présidentielles successives.",
        impactParClasse: {
          populaires: { score: 1, avantages: ["Bénéficie en priorité aux carrières commencées tôt et aux métiers pénibles, plus représentés dans cette catégorie", "Revalorisation des petites pensions au niveau du Smic"], risques: ["Financement non détaillé publiquement, donc incertitude sur qui supporte le coût à terme"], angleMort: "Le chiffrage précis du coût et de son financement n'est pas public à ce stade de la campagne." },
          moyennes: { score: 0, avantages: ["Départ plus précoce pour les carrières complètes à 40 ans"], risques: ["Si financée par la fiscalité ou les cotisations, une partie de cette catégorie pourrait contribuer sans bénéficier de la même revalorisation"], angleMort: "Aucune indication publique sur un éventuel geste fiscal ciblant spécifiquement cette catégorie." },
          aisees: { score: -1, avantages: [], risques: ["Combinée aux mesures fiscales du même programme, cette catégorie est identifiée comme contributrice nette probable au financement"], angleMort: "Le lien précis entre cette mesure et les mesures fiscales n'est pas établi par un document budgétaire chiffré public." },
          retraites: { score: 2, avantages: ["Effet direct et immédiat pour les futurs retraités concernés", "Revalorisation des pensions les plus faibles"], risques: ["Pérennité financière du système à moyen terme non démontrée par un chiffrage indépendant public"], angleMort: "Le Conseil d'orientation des retraites n'a pas publié d'évaluation officielle de cette proposition spécifique à ce stade." },
        },
      },
      {
        id: "jlm-fiscalite",
        theme: "Fiscalité",
        titre: "Nouvelles tranches d'impôt sur le revenu et alignement de la fiscalité du capital sur celle du travail",
        resumeOfficiel:
          "Création de tranches supplémentaires d'impôt sur le revenu pour les hauts revenus et taxation des revenus du capital au même barème que les revenus du travail, pour financer les services publics et réduire les inégalités.",
        sourceOfficielle: "https://www.elyseescope.com/le-radar/programme-economique-melenchon-2027",
        niveauConfiance: "annonce",
        noteConfiance: "Cohérent avec le programme « L'Avenir en commun » des campagnes précédentes, mais chiffrage 2027 non retrouvé dans une source de premier rang.",
        impactParClasse: {
          populaires: { score: 0, avantages: ["Non concernées par les tranches ou la taxation du capital"], risques: [], angleMort: "Le programme ne précise pas d'affectation ciblée d'une partie des recettes vers cette catégorie." },
          moyennes: { score: 0, avantages: ["Non concernées par le haut de barème visé"], risques: ["Une partie supérieure de cette catégorie détenant une épargne financière pourrait être affectée, sans seuil exact public"], angleMort: "Absence de seuil précis pour distinguer petite épargne et gros patrimoine financier." },
          aisees: { score: -2, avantages: [], risques: ["Hausse significative de la charge fiscale sur les hauts revenus et les revenus du capital", "Risque d'optimisation ou de délocalisation fiscale évoqué par des économistes critiques"], angleMort: "Aucun chiffrage indépendant public du rendement budgétaire attendu." },
          retraites: { score: 0, avantages: ["Neutre pour la quasi-totalité des pensions"], risques: [], angleMort: "Effet possible pour une minorité de retraités disposant de revenus du capital importants, non quantifié." },
        },
      },
    ],
  },
  {
    id: "attal",
    nom: "Gabriel Attal",
    parti: "Renaissance",
    mesures: [
      {
        id: "ga-ecole",
        theme: "Services publics",
        titre: "Réforme de l'école dès la rentrée 2027 (brevet obligatoire, groupes de niveau, fermeture des collèges les plus difficiles)",
        resumeOfficiel:
          "Brevet des collèges rendu obligatoire pour l'entrée au lycée, généralisation des groupes de niveau en français et mathématiques, ministre de l'Éducation nommé pour la durée du quinquennat, et fermeture d'une centaine de collèges qualifiés par le candidat de « ghettos scolaires ».",
        sourceOfficielle: "https://lcp.fr/actualites/presidentielle-retour-du-certificat-d-etudes-revalorisation-des-salaires-ce-que-propose",
        niveauConfiance: "confirme",
        noteConfiance: "Rapporté par LCP (chaîne de l'Assemblée nationale) à partir d'un entretien donné au Monde le 25 août 2026.",
        impactParClasse: {
          populaires: { score: -1, avantages: ["Objectif affiché de mixité sociale via la fermeture des collèges les plus en difficulté"], risques: ["Les groupes de niveau ont déjà été contestés par une partie des enseignants lors d'une première tentative en 2023-2024"], angleMort: "Le sort concret des familles déplacées par la fermeture de collèges n'est pas détaillé publiquement." },
          moyennes: { score: 0, avantages: ["Stabilité pédagogique recherchée via un ministre fixé sur la durée du quinquennat"], risques: [], angleMort: "Effet sur les collèges privés sous contrat non précisé." },
          aisees: { score: 0, avantages: [], risques: [], angleMort: "Mesure centrée sur le public, effet indirect non chiffré sur les stratégies de scolarisation privée." },
          retraites: { score: 0, avantages: [], risques: [], angleMort: "Mesure sans lien direct avec cette catégorie." },
        },
      },
      {
        id: "ga-salaires",
        theme: "Pouvoir d'achat",
        titre: "Réduire l'écart entre salaire brut et salaire net",
        resumeOfficiel:
          "Annoncé comme l'un des quatre « chantiers capitaux » de la campagne (avec l'école, les frontières et l'IA) : augmenter le salaire net à coût du travail constant pour l'employeur, sans mécanisme précis encore détaillé.",
        sourceOfficielle: "https://actu.orange.fr/politique/presidentielle-2027-gabriel-attal-revele-les-premieres-lignes-de-son-programme-magic-CNT000002pzsbo.html",
        niveauConfiance: "annonce",
        noteConfiance: "Priorité confirmée par plusieurs médias (Le Parisien, LCP, Orange Actu), mais mécanisme de mise en œuvre non encore publié.",
        impactParClasse: {
          populaires: { score: 1, avantages: ["Une hausse du net à brut constant profiterait proportionnellement plus aux bas salaires si elle passe par une baisse de cotisations salariales"], risques: ["Question ouverte du financement de la Sécurité sociale si la mesure passe par une baisse des cotisations"], angleMort: "Aucun mécanisme précis rendu public : impossible d'évaluer l'ampleur réelle du gain." },
          moyennes: { score: 1, avantages: ["Gain de pouvoir d'achat potentiel si la mesure s'applique à l'ensemble des salariés"], risques: [], angleMort: "Seuil de salaire concerné (s'il y en a un) non communiqué." },
          aisees: { score: 0, avantages: [], risques: [], angleMort: "Effet sur les hauts salaires non précisé." },
          retraites: { score: 0, avantages: [], risques: ["Mesure centrée sur les actifs ; aucune mesure miroir annoncée pour les pensions à ce stade"], angleMort: "Le programme ne traite pas explicitement du pouvoir d'achat des retraités dans cette annonce." },
        },
      },
    ],
  },
  {
    id: "philippe",
    nom: "Édouard Philippe",
    parti: "Horizons",
    mesures: [
      {
        id: "ep-chomage",
        theme: "Travail & emploi",
        titre: "Réduire à 12 mois la durée d'indemnisation chômage pour les moins de 50 ans",
        resumeOfficiel: "Présenté par le candidat comme un alignement sur le modèle allemand, dans un programme économique axé sur la maîtrise de la dépense publique.",
        sourceOfficielle: "https://www.lejdd.fr/economie/presidentielle-edouard-philippe-compte-reduire-lindemnisation-du-chomage-et-mettre-fin-a-lopen-bar-des-arrets-de-travail-181923",
        niveauConfiance: "confirme",
        noteConfiance: "Rapporté par le JDD et confirmé lors du débat des candidats organisé par le Medef, selon France Info.",
        impactParClasse: {
          populaires: { score: -1, avantages: [], risques: ["Réduction de la durée de couverture pour les demandeurs d'emploi les plus exposés au chômage de longue durée"], angleMort: "Le programme ne précise pas de mesure d'accompagnement spécifique pour les publics les plus fragiles." },
          moyennes: { score: -1, avantages: [], risques: ["Réduction de la sécurité en cas de perte d'emploi pour les salariés en milieu de carrière"], angleMort: "Effet différencié selon les secteurs non détaillé." },
          aisees: { score: 0, avantages: [], risques: ["Effet limité pour les cadres, dont la durée de recherche d'emploi est statistiquement plus courte"], angleMort: "Pas de donnée publique sur l'effet différencié par catégorie socioprofessionnelle." },
          retraites: { score: 0, avantages: [], risques: [], angleMort: "Mesure sans effet direct sur cette catégorie." },
        },
      },
      {
        id: "ep-regle-or",
        theme: "Fiscalité",
        titre: "Constitutionnaliser une règle d'or budgétaire limitant les déficits publics",
        resumeOfficiel: "Inscrire dans la Constitution une limite aux déficits publics, avec un objectif de retour sous les 3 % de déficit d'ici 2030, sans détail chiffré public sur la trajectoire.",
        sourceOfficielle: "https://www.franceinfo.fr/elections/presidentielle/dette-publique-retraites-reindustrialisation-ce-qu-il-faut-retenir-du-premier-debat-des-principaux-candidats-a-la-presidentielle_8165342.html",
        niveauConfiance: "annonce",
        noteConfiance: "Objectif confirmé par France Info (débat Medef) ; la trajectoire précise n'est pas publique à ce stade.",
        impactParClasse: {
          populaires: { score: -1, avantages: [], risques: ["Si l'objectif est atteint par une baisse des dépenses publiques, cette catégorie est historiquement plus dépendante des prestations concernées"], angleMort: "Le candidat n'a pas précisé la répartition entre hausses de recettes et baisses de dépenses." },
          moyennes: { score: 0, avantages: [], risques: ["Exposition possible si la trajectoire passe par une hausse de la fiscalité générale"], angleMort: "Absence de détail sur les postes de dépenses ou de recettes concernés." },
          aisees: { score: 0, avantages: [], risques: [], angleMort: "Aucun élément public ne permet d'évaluer un effet spécifique sur cette catégorie." },
          retraites: { score: 0, avantages: [], risques: ["Les dépenses de retraite représentant une part importante de la dépense publique, un objectif de maîtrise budgétaire pourrait à terme les concerner"], angleMort: "Aucune mesure retraite chiffrée n'est associée publiquement à cet objectif." },
        },
      },
    ],
  },
  {
    id: "retailleau",
    nom: "Bruno Retailleau",
    parti: "Les Républicains",
    mesures: [
      {
        id: "br-rsa",
        theme: "Travail & emploi",
        titre: "Conditionner plus strictement le RSA à l'acceptation d'offres d'emploi",
        resumeOfficiel: "Dans la continuité de la loi pour le plein emploi, durcir les conditions de maintien du RSA en cas de refus répété d'offres d'emploi jugées raisonnables.",
        sourceOfficielle: "https://www.elyseescope.com/questions/programme-retailleau-lr-2027-securite-immigration",
        niveauConfiance: "annonce",
        noteConfiance: "Orientation cohérente avec les positions connues de Bruno Retailleau et de LR, mais modalités précises non retrouvées dans une source de premier rang.",
        impactParClasse: {
          populaires: { score: -1, avantages: ["Objectif affiché d'insertion professionnelle plus rapide"], risques: ["Risque de sanctions pour des allocataires confrontés à des freins réels à l'emploi (garde d'enfants, mobilité, santé)", "Associations de lutte contre la pauvreté généralement critiques de ce type de conditionnalité"], angleMort: "Le programme ne détaille pas les moyens d'accompagnement prévus en parallèle de la sanction." },
          moyennes: { score: 0, avantages: [], risques: [], angleMort: "Mesure sans effet direct pour cette catégorie, non bénéficiaire du RSA dans son ensemble." },
          aisees: { score: 0, avantages: [], risques: [], angleMort: "Mesure sans lien avec cette catégorie." },
          retraites: { score: 0, avantages: [], risques: [], angleMort: "Mesure sans effet direct ; peut concerner des inactifs non retraités selon la catégorie retenue." },
        },
      },
    ],
  },
  {
    id: "le-pen",
    nom: "Marine Le Pen",
    parti: "Rassemblement national",
    mesures: [
      {
        id: "mlp-tva",
        theme: "Pouvoir d'achat",
        titre: "Suppression ou forte baisse de la TVA sur les produits de première nécessité",
        resumeOfficiel: "Réduire ou supprimer la TVA sur l'énergie, l'alimentation et le carburant pour soutenir le pouvoir d'achat, sans calendrier ni chiffrage détaillé rendus publics pour 2027.",
        sourceOfficielle: "https://www.elyseescope.com/le-radar/programme-economique-marine-le-pen-rn-2027",
        niveauConfiance: "confirme",
        noteConfiance: "Position historique du RN documentée sur plusieurs campagnes successives (2017, 2022) ; modalités précises 2027 à préciser.",
        impactParClasse: {
          populaires: { score: 2, avantages: ["Effet direct et proportionnellement plus favorable pour les ménages consacrant une part importante de leur revenu à ces produits"], risques: ["Financement du manque à gagner de TVA non détaillé publiquement"], angleMort: "Aucun chiffrage indépendant public du coût budgétaire de la mesure." },
          moyennes: { score: 1, avantages: ["Gain de pouvoir d'achat, dans une proportion moindre du revenu que pour les classes populaires"], risques: [], angleMort: "Effet exact selon la composition du panier de consommation, non détaillé." },
          aisees: { score: 0, avantages: ["Gain en valeur absolue possible mais marginal en proportion du revenu"], risques: [], angleMort: "Non chiffré spécifiquement pour cette catégorie." },
          retraites: { score: 1, avantages: ["Effet positif pour les retraités aux pensions modestes, à la part de consommation contrainte proportionnellement élevée"], risques: [], angleMort: "Effet différencié selon le niveau de pension non chiffré publiquement." },
        },
      },
      {
        id: "mlp-ifi",
        theme: "Fiscalité",
        titre: "Suppression de l'IFI et création d'un impôt sur la fortune financière (IFF)",
        resumeOfficiel: "Remplacer l'impôt sur la fortune immobilière par un impôt ciblant les actifs financiers, présenté par le parti comme visant la « spéculation » plutôt que la détention d'un bien immobilier.",
        sourceOfficielle: "https://votons-2027.fr/candidats/le-pen/programme",
        niveauConfiance: "confirme",
        noteConfiance: "Proposition distinctive et récurrente du RN (dont 2022) ; barème précis de l'IFF non retrouvé dans une source de premier rang pour 2027.",
        impactParClasse: {
          populaires: { score: 0, avantages: [], risques: [], angleMort: "Mesure sans effet direct, cette catégorie n'étant concernée ni par l'IFI ni par l'IFF envisagé." },
          moyennes: { score: 0, avantages: ["Non concernées par les seuils habituels de ce type d'impôt"], risques: [], angleMort: "Seuil exact de l'IFF non publié." },
          aisees: { score: 0, avantages: ["Allègement pour les détenteurs de patrimoine immobilier important"], risques: ["Une partie de cette catégorie, si patrimoine financier important, pourrait être visée par le nouvel IFF sans barème public"], angleMort: "Rendement budgétaire comparé IFI/IFF non chiffré publiquement, effet net incertain." },
          retraites: { score: 0, avantages: [], risques: [], angleMort: "Effet marginal, sauf pour une minorité de retraités à patrimoine financier important, non quantifié." },
        },
      },
    ],
  },
];

export function getCandidat(id: string): Candidat | undefined {
  return CANDIDATS.find((c) => c.id === id);
}
