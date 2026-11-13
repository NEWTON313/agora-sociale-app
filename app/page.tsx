import { Suspense } from "react";
import Link from "next/link";
import ComparateurClasse from "@/components/ComparateurClasse";
import { QUESTIONS } from "@/lib/boussole";
import { AVIS_DONNEES_REELLES, CANDIDATS } from "@/lib/data";

// Aperçu fictif du résultat du test (proximité avec les positions documentées) : aucun candidat réel.
const EXEMPLE_RESULTAT = [
  { label: "Candidat A", score: "+75 %", width: 38, sens: "pos" as const, detail: "7 accords sur 8 positions documentées" },
  { label: "Candidat B", score: "+20 %", width: 10, sens: "pos" as const, detail: "3 accords sur 5 positions documentées" },
  { label: "Candidat C", score: "−33 %", width: 17, sens: "neg" as const, detail: "1 accord sur 3 positions documentées" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 -right-40 h-[560px] w-[560px] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: "radial-gradient(circle, #395670 0%, transparent 68%)" }}
        />
        <div className="relative max-w-[1180px] mx-auto px-6 py-24 max-[900px]:py-16 grid grid-cols-[1fr_420px] gap-16 items-center max-[900px]:grid-cols-1 max-[900px]:gap-12">
          <div>
            <div className="flex items-center gap-2.5 font-display text-[0.95rem] text-ink-faint mb-7 animate-rise">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-bleu" />
              {CANDIDATS.length} candidats · {QUESTIONS.length} questions · zéro étiquette partisane
            </div>

            <h1
              className="font-body font-semibold text-[clamp(2.6rem,5.4vw,4.5rem)] leading-[1.03] tracking-[-0.022em] max-w-[16ch] animate-rise"
              style={{ animationDelay: "0.05s" }}
            >
              Quels candidats sont proches de vos choix&nbsp;?
            </h1>

            <p
              className="text-[1.3rem] leading-relaxed max-w-[50ch] text-ink-soft mt-8 animate-rise"
              style={{ animationDelay: "0.12s" }}
            >
              Cinq minutes, deux étapes : votre situation, puis {QUESTIONS.length} choix entre deux propositions. Le test
              compare vos réponses aux positions <strong className="text-ink">documentées et sourcées</strong> des
              candidats, et montre à part l&apos;effet économique estimé de leurs mesures sur votre catégorie.
            </p>

            <div className="mt-11 flex items-center gap-7 flex-wrap animate-rise" style={{ animationDelay: "0.18s" }}>
              <Link
                href="/simulateur"
                className="group inline-flex items-center gap-3 bg-accent-bleu text-white font-display font-medium text-[1.05rem] px-8 py-4 rounded-md shadow-[0_14px_32px_-10px_rgba(30,58,95,0.55)] transition-all duration-300 hover:bg-accent-bleu-soft hover:-translate-y-0.5"
              >
                Faire le test, 5 minutes
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href="#comparateur"
                className="font-display text-[1rem] text-ink-soft underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-accent-bleu hover:decoration-accent-bleu"
              >
                Explorer les programmes sans faire le test
              </a>
            </div>

            <p className="mt-9 text-[0.9rem] text-ink-faint max-w-[56ch] animate-rise" style={{ animationDelay: "0.24s" }}>
              Ce site ne soutient aucun candidat et ne conserve aucune donnée. Les positions de nombreux candidats ne sont
              pas encore documentées : voir la{" "}
              <Link href="/methodologie" className="underline underline-offset-4 hover:text-accent-bleu">
                méthodologie
              </Link>{" "}
              et la page{" "}
              <Link href="/transparence" className="underline underline-offset-4 hover:text-accent-bleu">
                Transparence
              </Link>
              .
            </p>
          </div>

          <div
            aria-hidden="true"
            className="rounded-2xl bg-white border border-line shadow-premium p-8 animate-rise max-[900px]:max-w-[440px]"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="font-display text-[0.92rem] font-medium text-ink pb-5 mb-6 border-b border-line">
              Votre résultat pourrait ressembler à ça
            </div>
            <div className="flex flex-col gap-6">
              {EXEMPLE_RESULTAT.map((row) => (
                <div key={row.label}>
                  <div className="flex items-baseline justify-between gap-4 font-display">
                    <span className="text-[0.95rem] font-medium text-ink">{row.label}</span>
                    <span className="text-[0.95rem] font-medium tabular-nums whitespace-nowrap">{row.score}</span>
                  </div>
                  <div className="relative mt-2 h-2.5 rounded-full bg-paper-deep overflow-hidden">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-line-strong" />
                    <div
                      className={`absolute top-0 bottom-0 ${
                        row.sens === "pos" ? "left-1/2 bg-positif rounded-r-full" : "right-1/2 bg-negatif rounded-l-full"
                      }`}
                      style={{ width: `${row.width}%` }}
                    />
                  </div>
                  <div className="mt-1.5 font-display text-[0.82rem] text-ink-faint">{row.detail}</div>
                </div>
              ))}
            </div>
            <div className="mt-7 pt-5 border-t border-line font-body text-[0.85rem] text-ink-faint italic">
              Exemple illustratif — candidats fictifs
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-line bg-paper-deep/60">
        <div className="max-w-[1180px] mx-auto px-6 py-5 text-[0.88rem] leading-relaxed text-ink-soft">
          <strong className="font-display font-medium text-ink">Données en cours de constitution</strong>{" "}
          <span className="text-ink-faint">(mise à jour du {AVIS_DONNEES_REELLES.dateMaj})</span> — {AVIS_DONNEES_REELLES.texte}
        </div>
      </div>

      <div id="comparateur" className="max-w-[1180px] mx-auto px-6 pt-16 pb-24 scroll-mt-20">
        {/* useSearchParams nécessite un Suspense boundary en App Router */}
        <Suspense fallback={null}>
          <ComparateurClasse />
        </Suspense>
      </div>

      <section className="bg-accent-bleu text-white">
        <div className="max-w-[1180px] mx-auto px-6 py-20 flex items-center justify-between gap-10 flex-wrap">
          <div>
            <h2 className="font-body font-semibold text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.1] tracking-[-0.015em] max-w-[22ch]">
              Et pour vous, que changent ces programmes&nbsp;?
            </h2>
            <p className="mt-4 text-[1.1rem] text-white/75 max-w-[48ch]">
              Le calcul se fait dans votre navigateur : rien n&apos;est envoyé, rien n&apos;est conservé.
            </p>
          </div>
          <Link
            href="/simulateur"
            className="group inline-flex items-center gap-3 bg-white text-accent-bleu font-display font-medium text-[1.05rem] px-8 py-4 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.5)]"
          >
            Faire le test
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
