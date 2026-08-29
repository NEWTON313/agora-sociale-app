import type { ScorePersonnalise as ScorePersonnaliseResultat } from "@/lib/priorites";

function scoreToWidth(score: number) {
  return Math.min(Math.abs(score) / 2, 1) * 50;
}

export default function ScorePersonnalise({ resultat }: { resultat: ScorePersonnaliseResultat }) {
  const { scoreGlobal, themesCouverts, themesPonderes } = resultat;

  if (scoreGlobal === null) {
    return (
      <div className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft border-t border-line pt-3 bg-paper px-2.5 py-2 rounded">
        Score personnalisé non calculable — aucune mesure recensée sur vos thèmes prioritaires pour ce candidat
      </div>
    );
  }

  const width = scoreToWidth(scoreGlobal);
  const side = scoreGlobal >= 0 ? "positif" : "negatif";

  return (
    <div className="border-t border-line pt-3 bg-paper px-2.5 py-2.5 rounded">
      <div className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-faint mb-1.5">
        Score personnalisé selon vos priorités
      </div>
      <div
        className="relative h-2.5 bg-paper-raised border border-line rounded-sm overflow-hidden shadow-[inset_0_1px_2px_rgba(16,19,26,0.06)]"
        role="img"
        aria-label={`Score personnalisé ${scoreGlobal.toFixed(1)} sur une échelle de -2 à 2, ${themesCouverts} sur ${themesPonderes} thèmes prioritaires couverts`}
      >
        <div className="absolute left-1/2 top-[-1px] bottom-[-1px] w-px bg-ink z-10" />
        <div
          className={`absolute top-0 bottom-0 transition-[width] duration-500 ${
            side === "positif" ? "left-1/2 bg-gradient-to-r from-positif to-[#3a6f52]" : "right-1/2 bg-gradient-to-l from-negatif to-[#93392e]"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="font-mono text-[0.78rem] text-ink-faint mt-1.5">
        {scoreGlobal > 0 ? "+" : ""}
        {scoreGlobal.toFixed(1)} / 2 · {themesCouverts}/{themesPonderes} thème{themesPonderes > 1 ? "s" : ""} prioritaire
        {themesPonderes > 1 ? "s" : ""} couvert{themesCouverts > 1 ? "s" : ""}
      </div>
      {themesCouverts < themesPonderes && (
        <div className="font-mono text-[0.7rem] text-ink-faint mt-1 italic">
          Estimation basée sur une partie seulement de vos priorités : à interpréter avec prudence.
        </div>
      )}
    </div>
  );
}
