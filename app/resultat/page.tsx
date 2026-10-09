import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import ClassementPersonnalise from "@/components/ClassementPersonnalise";
import { CANDIDATS, CLASSES_SOCIALES, THEMES } from "@/lib/data";
import { decoderPartage, encoderPartage } from "@/lib/partage";
import { classerCandidats, LABELS_PRIORITE } from "@/lib/priorites";

type SearchParams = Promise<{ classe?: string | string[]; p?: string | string[] }>;

const HOTE_PUBLIC = "https://www.monchoix2027.com";

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
  // Hôte servi directement : monchoix2027.com redirige vers www, et les réseaux sociaux
  // fiabilisent mieux une vignette récupérée sans saut de redirection.
  const image = `${HOTE_PUBLIC}/api/carte?${qs}`;
  return {
    ...base,
    description,
    openGraph: {
      title: titre,
      description,
      url: `${HOTE_PUBLIC}/resultat?${qs}`,
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
      <section className="border-b border-line py-14">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="font-mono text-[0.8rem] uppercase tracking-wide text-ink-soft mb-2.5">Résultat partagé</div>
          <h1 className="font-display text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1.08] max-w-[22ch]">
            Ce que donne le comparateur pour : {classe.nom.toLowerCase()}
          </h1>
          <p className="text-[1.1rem] max-w-[62ch] text-ink-soft mt-4">{classe.description}.</p>
        </div>
      </section>

      <div className="max-w-[720px] mx-auto px-6 py-10 pb-20">
        <div className="p-6 bg-paper-raised border border-line rounded-lg shadow-elevated">
          <div className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft mb-2">Priorités indiquées</div>
          <ul className="flex flex-col gap-1.5 mb-5">
            {priorites.map((t) => (
              <li key={t} className="flex justify-between gap-3 text-[0.95rem] border-b border-dashed border-line pb-1.5">
                <span>{t}</span>
                <span className="font-mono text-[0.72rem] uppercase text-ink-faint whitespace-nowrap">
                  {LABELS_PRIORITE[partage.poids[t]]}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-[0.85rem] text-ink-soft italic mb-4">
            Score calculé d&apos;après ces priorités et les mesures recensées pour cette catégorie sociale. Ce n&apos;est
            ni un jugement de valeur ni une recommandation de vote — voir la{" "}
            <Link href="/methodologie#score-personnalise" className="underline">
              méthodologie
            </Link>
            . Le classement complet est toujours affiché.
          </p>

          <ClassementPersonnalise classement={classement} resultats={resultats} attenuerSuivants={false} />
        </div>

        <div className="mt-8 p-6 border border-dashed border-line-strong rounded-lg bg-paper">
          <h2 className="font-display text-xl mb-2">Et pour vous ?</h2>
          <p className="text-[0.95rem] text-ink-soft mb-4">
            Le résultat dépend de la situation et des priorités de chacun. Refaites le calcul avec les vôtres : 2
            minutes, le calcul se fait dans votre navigateur et rien n&apos;est conservé.
          </p>
          <Link
            href="/simulateur"
            className="inline-flex items-center bg-accent-bleu text-paper-raised font-mono text-[0.85rem] uppercase tracking-wide px-6 py-3.5 rounded shadow-premium hover:bg-accent-bleu-soft transition-colors"
          >
            Faire le test (2 min) →
          </Link>
        </div>
      </div>
    </>
  );
}
