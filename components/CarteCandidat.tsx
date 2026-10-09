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
    <article className="group/carte flex flex-col gap-6 rounded-2xl border border-line bg-paper-raised p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
      <header>
        <div className="font-body font-semibold text-[1.4rem] leading-tight tracking-[-0.01em]">{candidat.nom}</div>
        <div className="font-display text-[0.92rem] text-ink-faint mt-1">{candidat.parti}</div>
      </header>

      {mesures.length === 0 && (
        <p className="font-body text-[1rem] text-ink-soft border-t border-line pt-5">
          Aucune mesure recensée sur ce thème pour ce candidat.
        </p>
      )}

      {mesuresVisibles.map((mesure) => {
        const confirme = mesure.niveauConfiance === "confirme";
        return (
          <div key={mesure.id} className="border-t border-line pt-5 flex flex-col gap-4">
            <p className="font-body text-[1.06rem] leading-snug text-ink">{mesure.titre}</p>

            <span
              className="inline-flex items-center gap-2 self-start font-display text-[0.82rem]"
              style={{ color: confirme ? "#326049" : "#6b7280" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: confirme ? "#326049" : "#a7aeb9" }} />
              {confirme ? "Confirmé par plusieurs médias" : "Annoncé, détails à préciser"}
            </span>

            <Ledger impact={mesure.impactParClasse[classeActive]} />
          </div>
        );
      })}

      {mesures.length > 1 && (
        <button
          type="button"
          onClick={() => setDepliee((v) => !v)}
          aria-expanded={depliee}
          className="self-start font-display text-[0.88rem] text-accent-bleu underline-offset-4 hover:underline"
        >
          {depliee
            ? "Réduire"
            : `+ ${nbMasquees} autre${nbMasquees > 1 ? "s" : ""} mesure${nbMasquees > 1 ? "s" : ""} sur ce thème`}
        </button>
      )}

      {mesures.length === 0 && <Ledger impact={undefined} />}

      {scorePersonnalise && <ScorePersonnalise resultat={scorePersonnalise} />}

      <Link
        href={`/candidats/${candidat.id}`}
        className="mt-auto inline-flex items-center gap-2 border-t border-line pt-5 font-display text-[0.92rem] font-medium text-accent-bleu"
      >
        Voir la fiche complète
        <span aria-hidden="true" className="transition-transform duration-300 group-hover/carte:translate-x-1">→</span>
      </Link>
    </article>
  );
}
