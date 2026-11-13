import type { Metadata } from "next";
import ParcoursTest from "@/components/ParcoursTest";
import { QUESTIONS } from "@/lib/boussole";

export const metadata: Metadata = {
  title: "Le test : votre situation, puis vos choix",
  description:
    "En deux étapes : calculez votre catégorie sociale (méthode INSEE), puis choisissez entre deux propositions sur 11 thèmes pour voir quels candidats sont les plus proches de vos choix et l'effet économique estimé de leurs mesures sur votre situation. Aucune donnée conservée.",
  alternates: { canonical: "/simulateur" },
};

export default function SimulateurPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 -right-40 h-[480px] w-[480px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: "radial-gradient(circle, #395670 0%, transparent 68%)" }}
        />
        {/* Introduction volontairement courte : le premier champ doit être visible sans défiler sur téléphone. */}
        <div className="relative max-w-[760px] mx-auto px-6 py-10 max-sm:py-7">
          <div className="flex items-center gap-2.5 font-display text-[0.92rem] text-ink-faint mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bleu" />2 étapes · 5 minutes · aucune donnée conservée
          </div>
          <h1 className="text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.08] tracking-[-0.02em]">
            Votre situation, puis vos choix
          </h1>
          <p className="text-[1.02rem] leading-relaxed text-ink-soft mt-3">
            Votre catégorie sociale (méthode INSEE), puis {QUESTIONS.length} choix entre deux propositions, comparés aux
            positions documentées des candidats.
          </p>
        </div>
      </section>

      <div className="max-w-[760px] mx-auto px-6 pt-6 pb-24">
        <ParcoursTest />
        <div className="mt-10 rounded-xl bg-paper-deep/70 px-5 py-4 text-[0.92rem] leading-relaxed text-ink-soft">
          Le calcul se fait entièrement dans votre navigateur : aucune donnée n&apos;est envoyée ni conservée. Seul le
          partage, facultatif, utilise votre catégorie sociale et vos thèmes prioritaires (jamais vos revenus ni vos
          réponses) pour créer une carte.
        </div>
        <p className="mt-6 text-[0.9rem] text-ink-faint leading-relaxed">
          Méthode et sources des seuils : voir la{" "}
          <a href="/methodologie#simulateur" className="underline underline-offset-4 hover:text-accent-bleu">
            méthodologie du simulateur
          </a>
          . Ce résultat est une estimation statistique, pas un jugement sur votre situation personnelle.
        </p>
      </div>
    </>
  );
}
