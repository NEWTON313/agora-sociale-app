import { Suspense } from "react";
import ComparateurClasse from "@/components/ComparateurClasse";
import { AVIS_DONNEES_REELLES } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line py-16 overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-[1fr_360px] gap-13 items-center max-[900px]:grid-cols-1">
          <div>
            <div className="font-mono text-[0.8rem] uppercase tracking-wide text-ink-faint mb-3.5 flex items-center gap-2.5">
              <span className="inline-block w-5 h-px bg-line-strong" />
              Qui gagne, qui perd, mesure par mesure
            </div>
            <h1 className="font-display text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.04] max-w-[15ch] tracking-tight animate-rise">
              Comparez les programmes selon leur impact réel sur votre classe sociale.
            </h1>
            <p className="text-[1.18rem] max-w-[62ch] text-ink-soft mt-5 animate-rise" style={{ animationDelay: "0.08s" }}>
              L&apos;Agora Sociale croise les mesures phares des candidats avec quatre grandes catégories
              socio-économiques pour rendre visibles les avantages, les risques et les angles morts de chaque
              proposition — sans étiquette partisane.
            </p>
            <div className="mt-6 border-l-[3px] border-line-strong pl-4.5 py-3 text-[0.88rem] text-ink-soft bg-white shadow-xs rounded-r max-w-[60ch]">
              <strong>Neutralité :</strong> ce site ne soutient aucun candidat. Voir la méthodologie pour les règles de
              collecte des données.
            </div>
            <div className="mt-3 border-l-[3px] pl-4.5 py-3 text-[0.88rem] text-ink-soft bg-white shadow-xs rounded-r max-w-[60ch]" style={{ borderLeftColor: "#9c7539" }}>
              <strong>⚠️ Données en cours de constitution (màj {AVIS_DONNEES_REELLES.dateMaj}) :</strong>{" "}
              {AVIS_DONNEES_REELLES.texte}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="border border-line rounded-lg bg-white shadow-premium p-5.5 animate-rise max-[900px]:rotate-0 max-[900px]:max-w-[380px]"
            style={{ transform: "rotate(-1.2deg)", animationDelay: "0.15s" }}
          >
            <div className="font-mono text-[0.64rem] uppercase tracking-wide text-ink-faint mb-3.5 pb-3 border-b border-dashed border-line">
              Le registre — illustration
            </div>
            {[
              { label: "Classes populaires", width: 38, sens: "pos" as const },
              { label: "Classes moyennes", width: 15, sens: "pos" as const },
              { label: "Classes aisées", width: 42, sens: "neg" as const },
              { label: "Retraités & inactifs", width: 8, sens: "pos" as const },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-[96px_1fr] items-center gap-3 mb-3 last:mb-0">
                <div className="text-[0.76rem] text-ink-soft leading-tight">{row.label}</div>
                <div className="relative h-2.5 bg-paper border border-line rounded-sm overflow-hidden">
                  <div className="absolute left-1/2 top-[-1px] bottom-[-1px] w-px bg-ink" />
                  <div
                    className={`absolute top-0 bottom-0 ${row.sens === "pos" ? "left-1/2 bg-positif" : "right-1/2 bg-negatif"}`}
                    style={{ width: `${row.width}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-dashed border-line text-[0.72rem] text-ink-faint italic">
              Exemple illustratif — pas une mesure réelle
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-6 py-10 pb-20">
        {/* useSearchParams nécessite un Suspense boundary en App Router */}
        <Suspense fallback={null}>
          <ComparateurClasse />
        </Suspense>
      </div>
    </>
  );
}
