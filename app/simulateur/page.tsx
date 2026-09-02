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
      <section className="border-b border-line py-14">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="font-mono text-[0.8rem] uppercase tracking-wide text-ink-soft mb-2.5">
            2 minutes, aucune donnée conservée
          </div>
          <h1 className="font-display text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.05] max-w-[16ch]">
            À quelle catégorie appartenez-vous ?
          </h1>
          <p className="text-[1.15rem] max-w-[62ch] text-ink-soft mt-4.5">
            Ce simulateur calcule votre <strong>niveau de vie</strong> selon la méthode officielle de l&apos;INSEE
            pour déterminer votre catégorie sociale, puis vous indique quel candidat penche le plus en votre
            faveur en fonction de votre classe sociale et de vos priorités.
          </p>
          <div className="mt-6 border-l-[3px] border-line-strong pl-4 py-2.5 text-[0.88rem] text-ink-soft bg-paper max-w-[60ch]">
            Le calcul se fait entièrement dans votre navigateur (aucun appel serveur, aucune donnée conservée).
          </div>
        </div>
      </section>

      <div className="max-w-[720px] mx-auto px-6 py-10 pb-20">
        <SimulateurForm />
        <p className="mt-8 text-[0.82rem] text-ink-soft">
          Méthode et sources des seuils : voir la{" "}
          <a href="/methodologie#simulateur" className="underline">
            méthodologie du simulateur
          </a>
          . Ce résultat est une estimation statistique, pas un jugement sur votre situation personnelle.
        </p>
      </div>
    </>
  );
}
