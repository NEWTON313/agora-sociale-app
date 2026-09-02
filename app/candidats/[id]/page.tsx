import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CANDIDATS, CLASSES_SOCIALES, getCandidat } from "@/lib/data";

const COULEURS: Record<string, { fg: string; bg: string }> = {
  populaires: { fg: "#3d5a78", bg: "#e2e8ee" },
  moyennes: { fg: "#566f4d", bg: "#e6ebe3" },
  aisees: { fg: "#7a4258", bg: "#eee2e6" },
  retraites: { fg: "#9c7539", bg: "#f1e8d7" },
};

// Pré-génère une page statique par candidat au build (SSG).
export function generateStaticParams() {
  return CANDIDATS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const candidat = getCandidat(id);
  if (!candidat) return {};

  const themes = candidat.mesures.map((m) => m.theme).join(", ");
  const title = `${candidat.nom} (${candidat.parti}) — programme et mesures à la présidentielle 2027`;
  const description = `Impact des mesures de ${candidat.nom} (${candidat.parti}) sur chaque catégorie sociale : ${themes}. Sources, niveau de confiance et angle mort pour chaque mesure.`;

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

  return (
    <div className="max-w-[1180px] mx-auto px-6 pt-8 pb-20">
      <div className="pb-6 border-b border-line mb-8">
        <div className="font-mono text-[0.8rem] uppercase tracking-wide text-ink-soft mb-2">
          {candidat.nom} — {candidat.parti}
        </div>
        <h1 className="text-[2rem] font-display">Mesures recensées</h1>
      </div>

      {candidat.mesures.map((mesure) => (
        <div key={mesure.id} className="mb-14">
          <div className="flex justify-between items-end flex-wrap gap-4 mb-4">
            <div>
              <span className="font-mono text-[0.68rem] uppercase tracking-wide border border-current px-2 py-1">
                Thème : {mesure.theme}
              </span>
              <h2 className="text-[1.3rem] font-display mt-2">{mesure.titre}</h2>
            </div>
            <span
              className="font-mono text-[0.65rem] uppercase tracking-wide px-1.5 py-0.5 border"
              style={{
                color: mesure.niveauConfiance === "confirme" ? "#326049" : "#7a8090",
                borderColor: mesure.niveauConfiance === "confirme" ? "#326049" : "#7a8090",
              }}
            >
              {mesure.niveauConfiance === "confirme" ? "Confirmé par plusieurs médias" : "Annoncé, détails à préciser"}
            </span>
          </div>

          <p className="max-w-[70ch] text-ink-soft">
            {mesure.resumeOfficiel}{" "}
            <a href={mesure.sourceOfficielle} target="_blank" rel="noopener noreferrer" className="underline">
              Voir la source
            </a>
            .
          </p>
          {mesure.noteConfiance && (
            <p className="max-w-[70ch] text-[0.82rem] text-ink-soft mt-1 italic">{mesure.noteConfiance}</p>
          )}

          <div className="grid gap-px bg-line mt-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {CLASSES_SOCIALES.map((classe) => {
              const impact = mesure.impactParClasse[classe.id];
              const couleur = COULEURS[classe.id];
              return (
                <div key={classe.id} className="p-4.5" style={{ background: couleur.bg }}>
                  <div className="font-mono text-[0.72rem] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: couleur.fg }} />
                    {classe.nom}
                  </div>
                  <strong className="font-mono text-[0.78rem]">Score : {impact.score > 0 ? "+" : ""}{impact.score} / 2</strong>

                  <p className="text-[0.85rem] mt-1.5 font-semibold">Avantages</p>
                  <ul className="list-disc pl-4.5 text-[0.88rem]">
                    {impact.avantages.length ? impact.avantages.map((a, i) => <li key={i}>{a}</li>) : <li>Aucun bénéfice direct identifié</li>}
                  </ul>

                  <p className="text-[0.85rem] mt-2.5 font-semibold">Risques</p>
                  <ul className="list-disc pl-4.5 text-[0.88rem]">
                    {impact.risques.length ? impact.risques.map((r, i) => <li key={i}>{r}</li>) : <li>Aucun risque direct identifié</li>}
                  </ul>

                  <div className="mt-2.5 text-[0.82rem] text-ink-soft italic border-t border-dashed border-line pt-2">
                    Angle mort : {impact.angleMort}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="mt-2 text-[0.82rem] text-ink-soft max-w-[70ch]">
        Cette fiche ne recense que les mesures pour lesquelles une source vérifiable a été retrouvée au moment de la
        rédaction (28 août 2026). Voir la <a href="/methodologie" className="underline">méthodologie</a>.
      </p>
    </div>
  );
}
