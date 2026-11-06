/**
 * Positions documentées des candidats sur les questions de la boussole (lib/boussole.ts).
 * Chaque position renvoie à une mesure déjà recensée dans lib/data.ts : sa source et son niveau de confiance sont
 * ceux de la mesure (aucune position sans source). Une position absente de cette liste = non documentée (écartée du
 * calcul, jamais comptée comme un désaccord). Règle : on n'enregistre que ce que la mesure dit directement.
 */
export type Choix = "A" | "B";

export interface Position {
  candidat: string;
  question: number;
  choix: Choix;
  mesureId: string;
}

export const POSITIONS: Position[] = [
  // 1 — Smic
  { candidat: "arthaud", question: 1, choix: "A", mesureId: "na-smic-2000" },
  { candidat: "tondelier", question: 1, choix: "A", mesureId: "mt-smic" },
  // 2 — fiscalité des entreprises et du capital
  { candidat: "melenchon", question: 2, choix: "B", mesureId: "jlm-fiscalite" },
  { candidat: "glucksmann", question: 2, choix: "B", mesureId: "rg-heritage-salaires" },
  // 3 — âge légal
  { candidat: "melenchon", question: 3, choix: "A", mesureId: "jlm-retraites" },
  { candidat: "philippe", question: 3, choix: "B", mesureId: "ep-retraites-65-ans" },
  // 4 — capitalisation
  { candidat: "retailleau", question: 4, choix: "A", mesureId: "br-retraites" },
  // 5 — droit du sol
  { candidat: "retailleau", question: 5, choix: "A", mesureId: "br-droit-du-sol" },
  { candidat: "dupont-aignan", question: 5, choix: "A", mesureId: "nda-droit-du-sol" },
  { candidat: "le-pen", question: 5, choix: "A", mesureId: "mlp-immigration" },
  // 6 — quotas
  { candidat: "attal", question: 6, choix: "A", mesureId: "ga-immigration" },
  // 7 — mineurs délinquants
  { candidat: "attal", question: 7, choix: "A", mesureId: "ga-justice-mineurs" },
  { candidat: "retailleau", question: 7, choix: "A", mesureId: "br-majorite-penale" },
  // 11 — nucléaire
  { candidat: "melenchon", question: 11, choix: "B", mesureId: "jlm-nucleaire" },
  // 13 — protection de la production
  { candidat: "attal", question: 13, choix: "A", mesureId: "ga-preference-europeenne" },
  // 15 — RIC
  { candidat: "egger", question: 15, choix: "A", mesureId: "ce-ric-pouvoir-maires" },
  // 17 — sortie de l'UE ou de l'euro
  { candidat: "asselineau", question: 17, choix: "A", mesureId: "fa-frexit" },
  { candidat: "dupont-aignan", question: 17, choix: "A", mesureId: "nda-frexit" },
  // 18 — intégration européenne
  { candidat: "attal", question: 18, choix: "A", mesureId: "ga-etats-unis-europe" },
  { candidat: "retailleau", question: 18, choix: "B", mesureId: "br-bouclier-constitutionnel" },
  // 20 — service national obligatoire
  { candidat: "glucksmann", question: 20, choix: "A", mesureId: "rg-service-civique" },
  { candidat: "melenchon", question: 20, choix: "A", mesureId: "jlm-conscription-ecologique" },
  // 22 — OTAN
  { candidat: "philippe", question: 22, choix: "A", mesureId: "ep-ukraine-otan" },
  { candidat: "asselineau", question: 22, choix: "B", mesureId: "fa-frexit" },
  { candidat: "dupont-aignan", question: 22, choix: "B", mesureId: "nda-frexit" },
  // 3 — âge légal (ajouté le 2026-11-06)
  { candidat: "bouamrane", question: 3, choix: "B", mesureId: "kb-retraite-65-ans" },
  // 10 — régulation de l'installation des médecins (ajouté le 2026-11-06)
  { candidat: "batho", question: 10, choix: "A", mesureId: "db-reguler-installation-medecins" },
  // 15 — RIC (ajouté le 2026-11-06)
  { candidat: "batho", question: 15, choix: "A", mesureId: "db-ric-pouvoir-maires" },
  // 20 — service national obligatoire (ajouté le 2026-11-06)
  { candidat: "batho", question: 20, choix: "B", mesureId: "db-service-national-volontaire" },
];
