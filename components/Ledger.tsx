import type { ImpactClasse } from "@/lib/data";

function scoreToWidth(score: number) {
  return Math.min(Math.abs(score) / 2, 1) * 50;
}

export default function Ledger({ impact }: { impact: ImpactClasse | undefined }) {
  if (!impact) {
    return (
      <div className="font-display text-[0.88rem] text-ink-faint">
        Aucune mesure identifiée sur ce thème pour cette catégorie
      </div>
    );
  }

  const { score } = impact;
  const width = scoreToWidth(score);
  const label =
    score > 0 ? "Impact plutôt favorable" : score < 0 ? "Impact plutôt défavorable" : "Impact neutre ou non déterminant";
  const couleur = score > 0 ? "#326049" : score < 0 ? "#8f382f" : "#6b7280";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2.5">
        <span className="font-display text-[0.9rem] font-medium" style={{ color: couleur }}>
          {label}
        </span>
        <span className="font-display text-[0.85rem] text-ink-faint tabular-nums whitespace-nowrap">
          {score > 0 ? "+" : score < 0 ? "−" : ""}
          {Math.abs(score)} / 2
        </span>
      </div>
      <div
        className="relative h-2.5 rounded-full bg-paper-deep overflow-hidden"
        role="img"
        aria-label={`${label}, score ${score} sur une échelle de -2 à 2`}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-line-strong z-10" />
        <div
          className={`absolute top-0 bottom-0 transition-[width] duration-700 ease-out ${
            score >= 0 ? "left-1/2 bg-positif rounded-r-full" : "right-1/2 bg-negatif rounded-l-full"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
