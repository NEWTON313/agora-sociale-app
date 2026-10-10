import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BadgeParti from "@/components/BadgeParti";
import { CANDIDATS_ALPHABETIQUE, CLASSES_SOCIALES, getCandidat } from "@/lib/data";

const COULEURS: Record<string, { fg: string; bg: string }> = {
  populaires: { fg: "#3d5a78", bg: "#e2e8ee" },
  moyennes: { fg: "#566f4d", bg: "#e6ebe3" },
  aisees: { fg: "#7a4258", bg: "#eee2e6" },
  retraites: { fg: "#9c7539", bg: "#f1e8d7" },
};

// Pré-génère une page statique par candidat au build (SSG).
export function generateStaticParams() {
  return CANDIDATS_ALPHABETIQUE.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const candidat = getCandidat(id);
  if (!candidat) return {};

  const themes = candidat.mesures.map((m) => m.theme).join(", ");
  const title = `${candidat.nom} (${candidat.parti}) — programme et mesures à la présidentielle 2027`;
  const description = candidat.mesures.length
    ? `Impact des mesures de ${candidat.nom} (${candidat.parti}) sur chaque catégorie sociale : ${themes}. Sources, niveau de confiance et angle mort pour chaque mesure.`
    : `${candidat.nom} (${candidat.parti}), candidat déclaré à la présidentielle 2027 : aucune mesure sourcée recensée à ce stade. La fiche sera complétée dès que son programme se précise.`;

  return {
    title,
    description,
    alternates: { canonical: `/candidats/${candidat.id}` },
    openGraph: { title, description, url: `/candidats/${candidat.id}` },
    twitter: { title, description },
  };
}

export default async function FicheCandidatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidat = getCandidat(id);
  if (!candidat) notFound();

  const position = CANDIDATS_ALPHABETIQUE.findIndex((c) => c.id === candidat.id);
  const precedent = position > 0 ? CANDIDATS_ALPHABETIQUE[position - 1] : null;
  const suivant = position < CANDIDATS_ALPHABETIQUE.length - 1 ? CANDIDATS_ALPHABETIQUE[position + 1] : null;

  return (
    <div className="max-w-[1180px] mx-auto px-6 pt-12 pb-24">
      <nav aria-label="Navigation entre les fiches" className="flex flex-wrap items-center justify-between gap-4 mb-12 font-display text-[0.92rem]">
        <Link href="/candidats" className="text-ink-soft underline-offset-4 hover:text-accent-bleu hover:underline">
          ← Tous les candidats ({CANDIDATS_ALPHABETIQUE.length})
        </Link>
        <div className="flex flex-wrap items-center gap-6">
          {precedent && (
            <Link href={`/candidats/${precedent.id}`} className="text-ink-soft underline-offset-4 hover:text-accent-bleu hover:underline">
              ← {precedent.nom}
            </Link>
          )}
          {suivant && (
            <Link href={`/candidats/${suivant.id}`} className="text-ink-soft underline-offset-4 hover:text-accent-bleu hover:underline">
              {suivant.nom} →
            </Link>
          )}
        </div>
      </nav>

      <div className="pb-10 border-b border-line mb-12">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-[0.95rem] font-medium text-ink-soft">
          <BadgeParti parti={candidat.parti} className="!text-[0.82rem] !px-2.5 !py-1" />
          <span>
            {candidat.parti} · Mesures recensées : {candidat.mesures.length}
          </span>
        </div>
        <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em]">{candidat.nom}</h1>
      </div>

      {candidat.mesures.length === 0 && (
        <div className="max-w-[62ch] rounded-2xl border border-dashed border-line-strong bg-paper-deep/50 p-8 mb-16">
          <h2 className="text-[1.5rem] mb-3">Aucune mesure recensée à ce stade</h2>
          <p className="text-ink-soft leading-relaxed">
            {candidat.nom} figure dans le comparateur parce que sa candidature est officiellement déclarée, mais aucune
            mesure n&apos;a encore pu être recensée avec une source vérifiable dans les médias de référence. Plutôt que
            d&apos;extrapoler, la fiche reste vide : elle sera complétée dès que son programme se précise.
          </p>
        </div>
      )}

      {candidat.mesures.map((mesure) => (
        <div key={mesure.id} className="mb-20">
          <div className="flex justify-between items-end flex-wrap gap-4 mb-5">
            <div>
              <span className="font-display text-[0.9rem] font-medium text-accent-bleu">{mesure.theme}</span>
              <h2 className="text-[1.6rem] leading-snug mt-2 max-w-[44ch]">{mesure.titre}</h2>
            </div>
            <span
              className="inline-flex items-center gap-2 font-display text-[0.88rem]"
              style={{ color: mesure.niveauConfiance === "confirme" ? "#326049" : "#6b7280" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: mesure.niveauConfiance === "confirme" ? "#326049" : "#a7aeb9" }}
              />
              {mesure.niveauConfiance === "confirme" ? "Confirmé par plusieurs médias" : "Annoncé, détails à préciser"}
            </span>
          </div>

          <p className="max-w-[70ch] text-[1.05rem] leading-relaxed text-ink-soft">
            {mesure.resumeOfficiel}{" "}
            <a href={mesure.sourceOfficielle} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent-bleu">
              Voir la source
            </a>
            .
          </p>
          {mesure.noteConfiance && (
            <p className="max-w-[70ch] text-[0.92rem] text-ink-faint mt-2 italic leading-relaxed">{mesure.noteConfiance}</p>
          )}

          <div className="grid gap-5 mt-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {CLASSES_SOCIALES.map((classe) => {
              const impact = mesure.impactParClasse[classe.id];
              const couleur = COULEURS[classe.id];
              return (
                <div key={classe.id} className="rounded-2xl p-6" style={{ background: couleur.bg }}>
                  <div className="font-display text-[0.84rem] font-medium mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: couleur.fg }} />
                    {classe.nom}
                  </div>
                  <strong className="font-display text-[0.95rem]">Score : {impact.score > 0 ? "+" : ""}{impact.score} / 2</strong>

                  <p className="font-display text-[0.9rem] mt-4 font-medium">Avantages</p>
                  <ul className="list-disc pl-4.5 text-[0.95rem] leading-snug space-y-1 mt-1.5">
                    {impact.avantages.length ? impact.avantages.map((a, i) => <li key={i}>{a}</li>) : <li>Aucun bénéfice direct identifié</li>}
                  </ul>

                  <p className="font-display text-[0.9rem] mt-4 font-medium">Risques</p>
                  <ul className="list-disc pl-4.5 text-[0.95rem] leading-snug space-y-1 mt-1.5">
                    {impact.risques.length ? impact.risques.map((r, i) => <li key={i}>{r}</li>) : <li>Aucun risque direct identifié</li>}
                  </ul>

                  <div className="mt-5 text-[0.9rem] text-ink-soft italic border-t border-black/10 pt-3 leading-relaxed">
                    Angle mort : {impact.angleMort}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="mt-2 text-[0.92rem] text-ink-faint max-w-[70ch] leading-relaxed">
        Cette fiche ne recense que les mesures pour lesquelles une source vérifiable a été retrouvée au moment de la
        rédaction (28 août 2026). Voir la <a href="/methodologie" className="underline underline-offset-4 hover:text-accent-bleu">méthodologie</a>.
      </p>
    </div>
  );
}
