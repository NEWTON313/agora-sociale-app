import { Suspense } from "react";
import Link from "next/link";
import ComparateurClasse from "@/components/ComparateurClasse";
import { AVIS_DONNEES_REELLES } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line py-16 overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-[1fr_400px] gap-13 items-center max-[900px]:grid-cols-1">
          <div>
            <div className="font-mono text-[0.8rem] uppercase tracking-wide text-ink-faint mb-3.5 flex items-center gap-2.5">
              <span className="inline-block w-5 h-[2px] bg-accent-rouge opacity-60" />
              6 candidats · 9 thèmes · zéro étiquette partisane
            </div>

            <h1 className="font-display text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.04] max-w-[16ch] tracking-tight animate-rise">
              Quel candidat colle vraiment à votre situation&nbsp;?
            </h1>

            <p className="text-[1.18rem] max-w-[58ch] text-ink-soft mt-5 animate-rise" style={{ animationDelay: "0.08s" }}>
              2 minutes de questions, une méthode INSEE, un score calculé à partir de{" "}
              <strong>vos</strong> priorités — jamais l&apos;inverse. Classement complet
              systématique, jamais un seul nom mis en avant.
            </p>

            <div className="mt-7 flex items-center gap-4 flex-wrap animate-rise" style={{ animationDelay: "0.12s" }}>
              <Link
                href="/simulateur"
                className="inline-flex items-center gap-2 bg-accent-bleu text-paper-raised font-mono text-[0.85rem] uppercase tracking-wide px-6 py-3.5 rounded shadow-premium hover:bg-accent-bleu-soft transition-colors"
              >
                Faire le test (2 min) →
              </Link>
              <a
                href="#comparateur"
                className="font-mono text-[0.8rem] uppercase tracking-wide text-ink-soft underline underline-offset-4 hover:text-accent-bleu transition-colors"
              >
                Explorer sans faire le test
              </a>
            </div>

            <p className="mt-6 text-[0.8rem] text-ink-faint max-w-[60ch]">
              Ce site ne soutient aucun candidat.{" "}
              <Link href="/methodologie" className="underline hover:text-accent-bleu">
                Voir la méthodologie
              </Link>{" "}
              et les règles de collecte des données.
            </p>
          </div>

          <div
            aria-hidden="true"
            className="border border-line rounded-lg bg-white shadow-premium p-7 animate-rise max-[900px]:rotate-0 max-[900px]:max-w-[380px]"
            style={{ transform: "rotate(-1.2deg)", animationDelay: "0.18s" }}
          >
            <div className="font-mono text-[0.64rem] uppercase tracking-wide text-ink-faint mb-4 pb-3.5 border-b border-dashed border-line">
              Votre résultat pourrait ressembler à ça
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Classes populaires", width: 38, sens: "pos" as const },
                { label: "Classes moyennes", width: 15, sens: "pos" as const },
                { label: "Classes aisées", width: 42, sens: "neg" as const },
                { label: "Retraités & inactifs", width: 8, sens: "pos" as const },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-[132px_1fr] items-center gap-4">
                  <div className="text-[0.76rem] text-ink-soft leading-tight">{row.label}</div>
                  <div className="relative h-2.5 bg-paper rounded-sm overflow-hidden">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-line-strong" />
                    <div
                      className={`absolute top-0 bottom-0 ${row.sens === "pos" ? "left-1/2 bg-positif" : "right-1/2 bg-negatif"}`}
                      style={{ width: `${row.width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-3.5 border-t border-dashed border-line text-[0.72rem] text-ink-faint italic">
              Exemple illustratif — pas une mesure réelle
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-line bg-paper-raised">
        <div className="max-w-[1180px] mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 sm:gap-8 text-[0.82rem] text-ink-soft">
          <div className="flex-1">
            <strong className="text-ink">⚠️ Données en cours de constitution</strong>{" "}
            <span className="text-ink-faint">(màj {AVIS_DONNEES_REELLES.dateMaj})</span> — {AVIS_DONNEES_REELLES.texte}
          </div>
        </div>
      </div>

      <div id="comparateur" className="max-w-[1180px] mx-auto px-6 py-10 pb-20 scroll-mt-20">
        {/* useSearchParams nécessite un Suspense boundary en App Router */}
        <Suspense fallback={null}>
          <ComparateurClasse />
        </Suspense>
      </div>
    </>
  );
}
