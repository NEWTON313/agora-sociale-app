import { useState } from "react";
import Link from "next/link";
import type { Candidat, ClasseId, Theme } from "@/lib/data";
import type { ScorePersonnalise as ScorePersonnaliseResultat } from "@/lib/priorites";
import Ledger from "./Ledger";
import ScorePersonnalise from "./ScorePersonnalise";

interface Props {
  candidat: Candidat;
  theme: Theme;
  classeActive: ClasseId;
  scorePersonnalise?: ScorePersonnaliseResultat;
}

export default function CarteCandidat({ candidat, theme, classeActive, scorePersonnalise }: Props) {
  // .filter() et non .find() : un même thème peut regrouper plusieurs mesures d'un candidat
  // (ex. Édouard Philippe sur "Pouvoir d'achat et économie") depuis l'élargissement à 9 thèmes.
  const mesures = candidat.mesures.filter((m) => m.theme === theme);

  // Repliée par défaut au-delà de la première mesure : évite que les candidats avec
  // plusieurs mesures sur un même thème n'écrasent visuellement les autres cartes de
  // la grille (rien n'est supprimé, juste replié — voir la discussion UX du 2026-09-11).
  const [depliee, setDepliee] = useState(false);
  const mesuresVisibles = depliee || mesures.length <= 1 ? mesures : mesures.slice(0, 1);
  const nbMasquees = mesures.length - mesuresVisibles.length;

  return (
    <article className="border border-line rounded-lg bg-paper-raised p-5.5 flex flex-col gap-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-line-strong">
      <header className="flex justify-between items-start gap-2">
        <div className="font-display text-[1.18rem] tracking-tight">{candidat.nom}</div>
        <span className="font-mono text-[0.68rem] uppercase tracking-wide border border-current px-1.5 py-0.5 rounded">
          {candidat.parti}
        </span>
      </header>

      {mesures.length === 0 && (
        <p className="text-[0.94rem] text-ink-soft border-t border-dashed border-line pt-3">
          Aucune mesure recensée sur ce thème pour ce candidat.
        </p>
      )}

      {mesuresVisibles.map((mesure) => (
        <div key={mesure.id} className="border-t border-dashed border-line pt-3 flex flex-col gap-3">
          <p className="text-[0.94rem] text-ink-soft">{mesure.titre}</p>

          <span
            className="self-start font-mono text-[0.65rem] uppercase tracking-wide px-1.5 py-0.5 border"
            style={{
              color: mesure.niveauConfiance === "confirme" ? "#326049" : "#7a8090",
              borderColor: mesure.niveauConfiance === "confirme" ? "#326049" : "#7a8090",
            }}
          >
            {mesure.niveauConfiance === "confirme" ? "Confirmé par plusieurs médias" : "Annoncé, détails à préciser"}
          </span>

          <Ledger impact={mesure.impactParClasse[classeActive]} />
        </div>
      ))}

      {mesures.length > 1 && (
        <button
          type="button"
          onClick={() => setDepliee((v) => !v)}
          aria-expanded={depliee}
          className="self-start font-mono text-[0.72rem] uppercase tracking-wide text-ink-faint underline underline-offset-2 hover:text-accent-bleu transition-colors"
        >
          {depliee
            ? "Réduire ▲"
            : `+ ${nbMasquees} autre${nbMasquees > 1 ? "s" : ""} mesure${nbMasquees > 1 ? "s" : ""} sur ce thème`}
        </button>
      )}

      {mesures.length === 0 && <Ledger impact={undefined} />}

      {scorePersonnalise && <ScorePersonnalise resultat={scorePersonnalise} />}

      <Link
        href={`/candidats/${candidat.id}`}
        className="font-mono text-[0.78rem] underline"
      >
        Voir la fiche complète →
      </Link>
    </article>
  );
}
