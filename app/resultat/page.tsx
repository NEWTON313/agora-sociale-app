import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClassementPersonnalise from "@/components/ClassementPersonnalise";
import { CANDIDATS, CLASSES_SOCIALES, THEMES } from "@/lib/data";
import { decoderPartage, encoderPartage } from "@/lib/partage";
import { classerCandidats, LABELS_PRIORITE } from "@/lib/priorites";

type SearchParams = Promise<{ classe?: string | string[]; p?: string | string[] }>;

const premier = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  const partage = decoderPartage({ classe: premier(sp.classe), p: premier(sp.p) });
  // Pages à paramètres libres : jamais indexées, seule la vignette de partage compte.
  const base: Metadata = { title: "Résultat partagé", robots: { index: false, follow: false } };
  if (!partage) return base;

  const qs = encoderPartage(partage.classe, partage.poids);
  const titre = "Mon résultat — Mon Choix 2027";
  const description =
    "Voici ce que donne le comparateur selon ma catégorie sociale et mes priorités. À toi d'essayer : 2 minutes, aucune donnée conservée.";
  // Chemins relatifs : metadataBase (hôte www, voir lib/site.ts) les rend absolus.
  const image = `/api/carte?${qs}`;
  return {
    ...base,
    description,
    openGraph: {
      title: titre,
      description,
      url: `/resultat?${qs}`,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: titre, description, images: [image] },
  };
}

export default async function ResultatPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const partage = decoderPartage({ classe: premier(sp.classe), p: premier(sp.p) });
  if (!partage) redirect("/simulateur");

  const classe = CLASSES_SOCIALES.find((c) => c.id === partage.classe)!;
  const { classement, resultats } = classerCandidats(CANDIDATS, partage.classe, partage.poids);
  const priorites = THEMES.filter((t) => partage.poids[t] > 0).sort((a, b) => partage.poids[b] - partage.poids[a]);

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
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bleu" />Résultat partagé
          </div>
          <h1 className="text-[clamp(2.1rem,4.2vw,3.4rem)] leading-[1.05] tracking-[-0.02em] max-w-[22ch]">
            Ce que donne le comparateur pour : {classe.nom.toLowerCase()}
          </h1>
          <p className="text-[1.2rem] max-w-[56ch] text-ink-soft mt-6">{classe.description}.</p>
        </div>
      </section>

      <div className="max-w-[760px] mx-auto px-6 py-14 pb-24">
        <div className="p-9 bg-paper-raised border border-line rounded-2xl shadow-elevated max-sm:p-6">
          <div className="font-display text-[0.95rem] font-medium text-ink mb-3">Priorités indiquées</div>
          <ul className="flex flex-col gap-2 mb-6">
            {priorites.map((t) => (
              <li key={t} className="flex justify-between gap-3 text-[1rem] border-b border-line pb-2">
                <span>{t}</span>
                <span className="font-display text-[0.84rem] font-medium text-ink-faint whitespace-nowrap">
                  {LABELS_PRIORITE[partage.poids[t]]}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-[0.92rem] text-ink-soft italic mb-6 leading-relaxed">
            Score calculé d&apos;après ces priorités et les mesures recensées pour cette catégorie sociale. Ce n&apos;est
            ni un jugement de valeur ni une recommandation de vote — voir la{" "}
            <Link href="/methodologie#score-personnalise" className="underline">
              méthodologie
            </Link>
            . Le classement complet est toujours affiché.
          </p>

          <ClassementPersonnalise classement={classement} resultats={resultats} attenuerSuivants={false} />
        </div>

        <div className="mt-10 p-9 rounded-2xl bg-accent-bleu text-white max-sm:p-6">
          <h2 className="text-[1.7rem] mb-3">Et pour vous&nbsp;?</h2>
          <p className="text-[1.02rem] text-white/80 mb-6 max-w-[52ch]">
            Le résultat dépend de la situation et des priorités de chacun. Refaites le calcul avec les vôtres : 2
            minutes, le calcul se fait dans votre navigateur et rien n&apos;est conservé.
          </p>
          <Link
            href="/simulateur"
            className="inline-flex items-center gap-3 bg-white text-accent-bleu font-display text-[1.02rem] font-medium px-7 py-3.5 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.5)]"
          >
            Faire le test, 2 minutes →
          </Link>
        </div>
      </div>
    </>
  );
}
