import type { Metadata } from "next";
import BoussoleForm from "@/components/BoussoleForm";
import { QUESTIONS } from "@/lib/boussole";

export const metadata: Metadata = {
  title: "Boussole des candidats",
  description:
    "Choisissez entre deux propositions sur 11 thèmes et découvrez quels candidats sont le plus proches de vos choix, d'après leurs positions documentées et sourcées. Aucune donnée conservée.",
  alternates: { canonical: "/boussole" },
};

export default function BoussolePage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="max-w-[1180px] mx-auto px-6 py-16 max-[900px]:py-12">
          <div className="flex items-center gap-2.5 font-display text-[0.95rem] text-ink-faint mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bleu" />
            {QUESTIONS.length} questions · aucune donnée conservée · version de test
          </div>
          <h1 className="text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-0.022em] max-w-[20ch]">
            Quels candidats sont les plus proches de vos choix&nbsp;?
          </h1>
          <p className="text-[1.2rem] leading-relaxed max-w-[58ch] text-ink-soft mt-6">
            Pour chaque question, choisissez la proposition qui vous convient le mieux (l&apos;ordre est tiré au hasard) et
            son importance pour vous. Le calcul n&apos;utilise que les positions des candidats <strong className="text-ink">documentées
            par une source</strong> ; quand une position n&apos;est pas connue, elle est écartée, jamais comptée contre le candidat.
          </p>
        </div>
      </section>
      <div className="max-w-[760px] mx-auto px-6 py-12 pb-28">
        <BoussoleForm />
      </div>
    </>
  );
}
