import type { ImpactClasse } from "@/lib/data";

function scoreToWidth(score: number) {
  return Math.min(Math.abs(score) / 2, 1) * 50;
}

export default function Ledger({ impact }: { impact: ImpactClasse | undefined }) {
  if (!impact) {
    return (
      <div className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft border-t border-line pt-3">
        Aucune mesure identifiée sur ce thème pour cette catégorie
      </div>
    );
  }

  const { score } = impact;
  const width = scoreToWidth(score);
  const side = score >= 0 ? "positif" : "negatif";
  const label =
    score > 0 ? "Impact plutôt favorable" : score < 0 ? "Impact plutôt défavorable" : "Impact neutre / non déterminant";

  return (
    <div className="border-t border-line pt-3">
      <div className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-faint mb-1.5">{label}</div>
      <div
        className="relative h-2.5 bg-paper border border-line rounded-sm overflow-hidden shadow-[inset_0_1px_2px_rgba(16,19,26,0.06)]"
        role="img"
        aria-label={`${label}, score ${score} sur une échelle de -2 à 2`}
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
        score : {score > 0 ? "+" : ""}
        {score} / 2
      </div>
    </div>
  );
}
