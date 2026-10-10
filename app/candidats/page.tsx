import type { Metadata } from "next";
import Link from "next/link";
import { CANDIDATS, THEMES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Fiches candidats",
  description:
    "Les mesures recensées de chaque candidat à la présidentielle 2027, avec leur impact sur chaque catégorie sociale, leurs sources, leur niveau de confiance et leur angle mort.",
  alternates: { canonical: "/candidats" },
};

// Ordre alphabétique des identifiants (jamais par sondage ni popularité) : voir les garde-fous
// de neutralité de la méthodologie.
const candidatsTries = [...CANDIDATS].sort((a, b) => a.id.localeCompare(b.id));

export default function CandidatsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 -right-40 h-[480px] w-[480px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: "radial-gradient(circle, #395670 0%, transparent 68%)" }}
        />
        <div className="relative max-w-[1180px] mx-auto px-6 py-20 max-[900px]:py-14">
          <div className="flex items-center gap-2.5 font-display text-[0.95rem] text-ink-faint mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bleu" />
            {candidatsTries.length} candidats · ordre alphabétique
          </div>
          <h1 className="text-[clamp(2.3rem,4.6vw,3.8rem)] leading-[1.04] tracking-[-0.022em] max-w-[18ch]">
            Les fiches candidats
          </h1>
          <p className="text-[1.25rem] leading-relaxed max-w-[56ch] text-ink-soft mt-7">
            Chaque fiche recense les mesures pour lesquelles une source vérifiable a été retrouvée, avec leur impact sur
            les quatre catégories sociales, le niveau de confiance et l&apos;angle mort.
          </p>
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-6 py-16 pb-24">
        <ul className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
          {candidatsTries.map((c) => {
            const themes = THEMES.filter((t) => c.mesures.some((m) => m.theme === t));
            return (
              <li key={c.id}>
                <Link
                  href={`/candidats/${c.id}`}
                  className="group flex h-full flex-col gap-5 rounded-2xl border border-line bg-paper-raised p-8 shadow-card no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
                >
                  <div>
                    <div className="font-body text-[1.5rem] font-semibold leading-tight tracking-[-0.01em]">{c.nom}</div>
                    <div className="font-display text-[0.95rem] text-ink-faint mt-1">{c.parti}</div>
                  </div>
                  <p className="font-display text-[0.95rem] text-ink-soft">
                    {c.mesures.length} mesure{c.mesures.length > 1 ? "s" : ""} recensée{c.mesures.length > 1 ? "s" : ""} sur{" "}
                    {themes.length} thème{themes.length > 1 ? "s" : ""}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {themes.map((t) => (
                      <li key={t} className="rounded-full bg-paper-deep px-3 py-1 font-display text-[0.8rem] text-ink-soft">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 border-t border-line pt-5 font-display text-[0.92rem] font-medium text-accent-bleu">
                    Voir la fiche complète
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
