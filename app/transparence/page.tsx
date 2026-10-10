import type { Metadata } from "next";
import { AVIS_DONNEES_REELLES, CANDIDATS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Transparence",
  description:
    "Qui fait Mon Choix 2027, comment les données sont produites (avec une IA, sans relecture humaine systématique), quelles sources sont utilisées, quelles limites existent et comment signaler une erreur.",
  alternates: { canonical: "/transparence" },
};

const DEPOT = "https://github.com/NEWTON313/agora-sociale-app";

/** Domaines des sources effectivement citées dans les données, avec leur nombre d'occurrences. */
function sourcesUtilisees(): { domaine: string; nb: number }[] {
  const compte = new Map<string, number>();
  for (const c of CANDIDATS) {
    for (const m of c.mesures) {
      try {
        const domaine = new URL(m.sourceOfficielle).hostname.replace(/^www\./, "");
        compte.set(domaine, (compte.get(domaine) ?? 0) + 1);
      } catch {
        compte.set("(lien invalide)", (compte.get("(lien invalide)") ?? 0) + 1);
      }
    }
  }
  return [...compte.entries()].map(([domaine, nb]) => ({ domaine, nb })).sort((a, b) => b.nb - a.nb || a.domaine.localeCompare(b.domaine));
}

export default function TransparencePage() {
  const mesures = CANDIDATS.flatMap((c) => c.mesures);
  const sansMesure = CANDIDATS.filter((c) => c.mesures.length === 0).length;
  const confirmees = mesures.filter((m) => m.niveauConfiance === "confirme").length;
  const sources = sourcesUtilisees();

  return (
    <div className="max-w-[820px] mx-auto px-6 pt-16 pb-24">
      <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] mb-5">Transparence</h1>
      <p className="text-[1.2rem] leading-relaxed text-ink-soft">
        Un comparateur ne peut prouver sa neutralité qu&apos;en montrant comment il travaille, y compris ses
        faiblesses. Cette page dit ce que nous faisons, avec quels outils, ce qui n&apos;est pas vérifié, et comment
        vous pouvez contrôler ou contester chaque donnée.
      </p>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Les chiffres, en direct</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-display text-[0.84rem] font-medium text-ink-soft">Candidats dans le comparateur</dt>
            <dd className="font-display text-[1.4rem]">{CANDIDATS.length}</dd>
          </div>
          <div>
            <dt className="font-display text-[0.84rem] font-medium text-ink-soft">Dont sans aucune mesure recensée</dt>
            <dd className="font-display text-[1.4rem]">{sansMesure}</dd>
          </div>
          <div>
            <dt className="font-display text-[0.84rem] font-medium text-ink-soft">Mesures sourcées</dt>
            <dd className="font-display text-[1.4rem]">{mesures.length}</dd>
          </div>
          <div>
            <dt className="font-display text-[0.84rem] font-medium text-ink-soft">Dont « confirmées » / « annoncées »</dt>
            <dd className="font-display text-[1.4rem]">
              {confirmees} / {mesures.length - confirmees}
            </dd>
          </div>
        </dl>
        <p className="text-[0.9rem] text-ink-soft mt-4">Dernière mise à jour des données : {AVIS_DONNEES_REELLES.dateMaj}.</p>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Qui fait ce site, et avec quel argent</h2>
        <p>
          Mon Choix 2027 est un projet citoyen et non partisan, en open source. Il n&apos;est financé par aucun parti,
          aucun candidat ni aucun annonceur, et ne contient aucune publicité à ce jour ; si cela devait changer, ce
          serait annoncé sur cette page. La fréquentation est mesurée de façon agrégée et anonyme (Vercel Analytics et
          Speed Insights), sans cookie publicitaire ni profil individuel.
        </p>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Comment les données sont produites</h2>
        <p>
          Les mesures des candidats sont recherchées, résumées et notées <strong>avec l&apos;aide d&apos;un assistant
          d&apos;intelligence artificielle</strong> (Claude, d&apos;Anthropic), qui met aussi les données à jour
          automatiquement environ tous les trois jours à partir d&apos;articles de presse. Il applique des règles
          écrites et identiques pour tous les candidats (voir la{" "}
          <a href="/methodologie" className="underline underline-offset-4">méthodologie</a>).
        </p>
        <p className="mt-3">
          <strong>À ce jour, aucune relecture humaine systématique n&apos;a lieu avant publication.</strong> Des
          vérifications automatiques contrôlent la structure des données (champs obligatoires, scores de -2 à +2, lien
          de source présent), mais pas l&apos;exactitude du fond : une erreur d&apos;interprétation, de résumé ou de
          notation reste possible. C&apos;est la raison pour laquelle chaque mesure renvoie à sa source et que vous
          pouvez signaler une erreur (voir plus bas).
        </p>
        <p className="mt-3">
          Règle de prudence : quand aucune source solide n&apos;est retrouvée, la case reste vide plutôt que
          complétée par extrapolation.
        </p>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Quels candidats figurent dans le comparateur</h2>
        <p>
          Tout candidat officiellement déclaré, selon les médias de référence (franceinfo, LCP, France 24, Le JDD),
          figure dans le comparateur, par ordre alphabétique, <strong>sans condition de sondage ni de nombre de
          mesures</strong>. Un candidat qui retire officiellement sa candidature, ou qui perd une primaire dont le
          résultat est connu, est retiré. Aucune candidature n&apos;est validée à ce stade par le Conseil
          constitutionnel. Les personnes qui démentent être candidates, ou qui sont seulement pressenties, n&apos;y
          figurent pas.
        </p>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Comment une mesure est notée</h2>
        <p>
          Pour chacune des quatre catégories (classes populaires, moyennes, aisées, retraités et inactifs), une mesure
          reçoit un score de -2 à +2 : une <strong>estimation de l&apos;effet économique direct</strong> sur le niveau
          de vie de la catégorie (-2 : effet nettement défavorable ; 0 : neutre ou indéterminé ; +2 : effet nettement
          favorable), accompagnée des avantages et des risques documentés et d&apos;un « angle mort » : ce que la mesure
          ou son chiffrage ne permettent pas de conclure. Le même barème s&apos;applique à tous les candidats, quelle
          que soit leur famille politique. Cette notation reste une estimation, pas une mesure.
        </p>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">D&apos;où viennent les informations</h2>
        <p>
          Chaque mesure renvoie à une source, avec un niveau de confiance : <strong>« confirmé »</strong> (média
          reconnu ou position documentée sur plusieurs campagnes) ou <strong>« annoncé »</strong> (déclaration sans
          détail chiffré). Voici les sources effectivement citées aujourd&apos;hui :
        </p>
        <ul className="mt-3 list-disc pl-5 space-y-1">
          {sources.map((s) => (
            <li key={s.domaine}>
              {s.domaine} — {s.nb} mesure{s.nb > 1 ? "s" : ""}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          La recherche automatique est volontairement limitée à quatre médias (franceinfo, Le JDD, LCP, France 24),
          pour éviter les sites agrégateurs de fiabilité non vérifiée. Ce choix a un coût que nous assumons : certains
          médias ne peuvent pas être consultés par l&apos;outil, et ce périmètre n&apos;est pas un panel pluraliste
          garanti de la presse française. Les programmes officiels des partis sont à privilégier dès qu&apos;ils sont
          publiés.
        </p>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Ce qui peut fausser la comparaison</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Une couverture inégale.</strong> {sansMesure} candidats sur {CANDIDATS.length} n&apos;ont encore
            aucune mesure recensée : leur score est « non calculable », ce qui n&apos;est ni un bon ni un mauvais
            résultat. Les candidats dont le programme est plus détaillé ou plus médiatisé ont mécaniquement davantage
            de mesures.
          </li>
          <li>
            <strong>Une notation faite par une IA,</strong> susceptible de biais et d&apos;erreurs, sans second regard
            humain systématique.
          </li>
          <li>
            <strong>Des choix éditoriaux</strong> qui ne sont pas neutres par nature : le choix des 9 thèmes, des
            4 catégories sociales et des seuils de classement (déciles de l&apos;Insee).
          </li>
          <li>
            <strong>Un seul angle :</strong> l&apos;effet économique sur le niveau de vie. Les valeurs, les libertés,
            la politique étrangère ou l&apos;écologie ne sont mesurées ici que par leur effet économique direct, et ne
            remplacent pas la lecture des programmes.
          </li>
          <li>
            <strong>Un score personnalisé</strong> qui combine des estimations déjà incertaines : ce n&apos;est ni un
            classement, ni une recommandation de vote.
          </li>
        </ul>
      </section>

      <section className="py-12">
        <h2 className="text-[1.7rem] mb-6">Contrôler, contester, corriger</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Code et données publics</strong> (licence MIT) :{" "}
            <a href={DEPOT} className="underline underline-offset-4">{DEPOT.replace("https://", "")}</a>. Les données sont
            dans le fichier <code className="font-mono">lib/data.ts</code>.
          </li>
          <li>
            <strong>Historique complet des modifications des données,</strong> daté et conservé :{" "}
            <a href={`${DEPOT}/commits/main/lib/data.ts`} className="underline underline-offset-4">
              voir les changements
            </a>
            .
          </li>
          <li>
            <strong>Signaler une erreur ou demander une correction</strong> (citoyen·ne, journaliste, candidat·e ou
            équipe de campagne), idéalement avec une source :{" "}
            <a href={`${DEPOT}/issues/new`} className="underline underline-offset-4">
              ouvrir un signalement public
            </a>
            . Les demandes et leur suite sont publiques, pour que chacun puisse vérifier qu&apos;elles sont traitées
            de la même façon quel que soit leur auteur.
          </li>
        </ul>
      </section>
    </div>
  );
}
