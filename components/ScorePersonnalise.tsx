import type { ScorePersonnalise as ScorePersonnaliseResultat } from "@/lib/priorites";

function scoreToWidth(score: number) {
  return Math.min(Math.abs(score) / 2, 1) * 50;
}

export default function ScorePersonnalise({ resultat }: { resultat: ScorePersonnaliseResultat }) {
  const { scoreGlobal, themesCouverts, themesPonderes } = resultat;

  if (scoreGlobal === null) {
    return (
      <div className="rounded-xl bg-paper-deep/60 px-4 py-3 font-display text-[0.88rem] text-ink-soft">
        Score personnalisé non calculable : aucune mesure recensée sur vos thèmes prioritaires pour ce candidat.
      </div>
    );
  }

  const width = scoreToWidth(scoreGlobal);
  const positif = scoreGlobal >= 0;
  const couleur = scoreGlobal > 0 ? "#326049" : scoreGlobal < 0 ? "#8f382f" : "#6b7280";

  return (
    <div className="rounded-xl bg-paper-deep/60 px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-3 mb-2.5">
        <span className="font-display text-[0.88rem] font-medium" style={{ color: couleur }}>
          Score personnalisé selon vos priorités
        </span>
        <span className="font-display text-[0.9rem] font-medium tabular-nums whitespace-nowrap" style={{ color: couleur }}>
          {scoreGlobal > 0 ? "+" : scoreGlobal < 0 ? "−" : ""}
          {Math.abs(scoreGlobal).toFixed(1)} / 2
        </span>
      </div>
      <div
        className="relative h-2.5 rounded-full bg-paper-raised overflow-hidden"
        role="img"
        aria-label={`Score personnalisé ${scoreGlobal.toFixed(1)} sur une échelle de -2 à 2, ${themesCouverts} sur ${themesPonderes} thèmes prioritaires couverts`}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-line-strong z-10" />
        <div
          className={`absolute top-0 bottom-0 transition-[width] duration-700 ease-out ${
            positif ? "left-1/2 bg-positif rounded-r-full" : "right-1/2 bg-negatif rounded-l-full"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="font-display text-[0.85rem] text-ink-faint mt-2">
        {themesCouverts}/{themesPonderes} thème{themesPonderes > 1 ? "s" : ""} prioritaire
        {themesPonderes > 1 ? "s" : ""} couvert{themesCouverts > 1 ? "s" : ""}
      </div>
      {themesCouverts < themesPonderes && (
        <div className="font-body text-[0.85rem] text-ink-faint mt-1 italic">
          Estimation basée sur une partie seulement de vos priorités : à interpréter avec prudence.
        </div>
      )}
    </div>
  );
}
