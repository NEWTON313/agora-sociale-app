import type { Metadata } from "next";
import SimulateurForm from "@/components/SimulateurForm";

export const metadata: Metadata = {
  title: "Simulateur : à quelle catégorie sociale appartenez-vous ?",
  description:
    "Calculez votre niveau de vie selon la méthode INSEE (revenu du foyer ÷ unités de consommation) et situez-vous automatiquement dans le comparateur des programmes 2027. Aucune donnée conservée.",
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
        <div className="relative max-w-[1180px] mx-auto px-6 py-20 max-[900px]:py-14">
          <div className="flex items-center gap-2.5 font-display text-[0.95rem] text-ink-faint mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bleu" />2 minutes, aucune donnée conservée
          </div>
          <h1 className="text-[clamp(2.3rem,4.6vw,3.8rem)] leading-[1.04] tracking-[-0.022em] max-w-[18ch]">
            À quelle catégorie appartenez-vous&nbsp;?
          </h1>
          <p className="text-[1.25rem] leading-relaxed max-w-[56ch] text-ink-soft mt-7">
            Ce simulateur calcule votre <strong className="text-ink">niveau de vie</strong> selon la méthode officielle de
            l&apos;INSEE pour déterminer votre catégorie sociale, puis vous indique quel candidat penche le plus en votre
            faveur en fonction de votre classe sociale et de vos priorités.
          </p>
          <div className="mt-8 rounded-xl bg-paper-deep/70 px-5 py-4 text-[0.92rem] leading-relaxed text-ink-soft max-w-[62ch]">
            Le calcul se fait entièrement dans votre navigateur : aucune donnée n&apos;est envoyée ni conservée. Seul le
            partage, facultatif, utilise votre catégorie sociale et vos priorités (jamais vos revenus) pour créer une carte.
          </div>
        </div>
      </section>

      <div className="max-w-[760px] mx-auto px-6 py-14 pb-24">
        <SimulateurForm />
        <p className="mt-10 text-[0.9rem] text-ink-faint leading-relaxed">
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
