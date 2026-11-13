import type { Metadata } from "next";
import { AVIS_DONNEES_REELLES, CANDIDATS } from "@/lib/data";
import { K_PRUDENCE, QUESTIONS, SEUIL_COUVERTURE } from "@/lib/boussole";
import { POSITIONS, niveauValidation, type NiveauValidation } from "@/lib/positions";

export const metadata: Metadata = {
  title: "Transparence",
  description:
    "Qui fait Mon Choix 2027, comment le test (situation puis boussole) et les données sont produits (avec une IA, relues par un humain avant publication depuis le 10/10/2026), quelles sources sont utilisées, quelles limites existent et comment signaler une erreur.",
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
  const positionsParCandidat = new Map<string, number>();
  for (const p of POSITIONS) positionsParCandidat.set(p.candidat, (positionsParCandidat.get(p.candidat) ?? 0) + 1);
  const classables = CANDIDATS.filter((c) => (positionsParCandidat.get(c.id) ?? 0) >= SEUIL_COUVERTURE).length;

  // Niveau de validation de chaque position (programme officiel, recoupée par plusieurs médias, source unique).
  const validations: Record<NiveauValidation, number> = { officielle: 0, recoupee: 0, unique: 0 };
  for (const p of POSITIONS) {
    const mesure = CANDIDATS.find((c) => c.id === p.candidat)?.mesures.find((m) => m.id === p.mesureId);
    if (mesure) validations[niveauValidation(p, mesure.sourceOfficielle)]++;
  }
  // Couverture de chaque question : combien de candidats ont une position documentée pour l'option A et pour l'option B.
  const couverture = QUESTIONS.map((q) => ({
    question: q,
    a: POSITIONS.filter((p) => p.question === q.id && p.choix === "A").length,
    b: POSITIONS.filter((p) => p.question === q.id && p.choix === "B").length,
  }));
  const questionsVides = couverture.filter((c) => c.a + c.b === 0).length;

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
          <div>
            <dt className="font-display text-[0.84rem] font-medium text-ink-soft">Positions documentées (boussole)</dt>
            <dd className="font-display text-[1.4rem]">
              {POSITIONS.length} <span className="text-[0.9rem] text-ink-soft">pour {QUESTIONS.length} questions</span>
            </dd>
          </div>
          <div>
            <dt className="font-display text-[0.84rem] font-medium text-ink-soft">
              Candidats avec au moins {SEUIL_COUVERTURE} positions (classables)
            </dt>
            <dd className="font-display text-[1.4rem]">
              {classables} <span className="text-[0.9rem] text-ink-soft">sur {CANDIDATS.length}</span>
            </dd>
          </div>
          <div>
            <dt className="font-display text-[0.84rem] font-medium text-ink-soft">
              Positions établies par un programme officiel / recoupées par plusieurs médias / à source unique
            </dt>
            <dd className="font-display text-[1.4rem]">
              {validations.officielle} / {validations.recoupee} / {validations.unique}
            </dd>
          </div>
          <div>
            <dt className="font-display text-[0.84rem] font-medium text-ink-soft">Questions sans aucune position documentée</dt>
            <dd className="font-display text-[1.4rem]">
              {questionsVides} <span className="text-[0.9rem] text-ink-soft">sur {QUESTIONS.length}</span>
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
          <strong>Depuis le 10 octobre 2026, l&apos;IA ne publie plus directement :</strong> elle propose ses mises à
          jour sous forme de demande de modification publique, que le responsable du site relit avant de les fusionner.
          Cette relecture porte sur les sources et la cohérence ; elle ne garantit pas l&apos;absence d&apos;erreur, et
          les mesures publiées avant cette date n&apos;ont pas toutes été relues une à une. Des vérifications
          automatiques contrôlent aussi la structure des données (champs obligatoires, scores de -2 à +2, lien de
          source présent), mais pas l&apos;exactitude du fond : une erreur d&apos;interprétation, de résumé ou de
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
        <h2 className="text-[1.7rem] mb-6">Comment fonctionne le test</h2>
        <p>
          Le test se fait en deux étapes, dans le même parcours, et tout reste dans votre navigateur (rien n&apos;est
          envoyé ni conservé). <strong>Étape 1 :</strong> votre situation détermine votre catégorie sociale.{" "}
          <strong>Étape 2 :</strong> {QUESTIONS.length} questions, chacune opposant deux propositions formulées de façon
          symétrique (l&apos;ordre est tiré au hasard à chaque visite), avec « sans avis » possible et une importance de 1
          à 3.
        </p>
        <p className="mt-3">
          <strong>Le classement repose sur la proximité avec vos choix.</strong> Pour chaque candidat, on ne compte que
          les questions où sa position est <em>documentée</em> par une source : accord = +importance, désaccord =
          −importance. Une position non documentée est écartée : elle n&apos;est jamais comptée comme un désaccord. Un
          candidat n&apos;est classé qu&apos;à partir de {SEUIL_COUVERTURE} questions couvertes ; les autres sont listés à
          part, par ordre alphabétique, sans note. Les égalités se départagent par ordre alphabétique, jamais par le
          nombre de mesures ni par les sondages.
        </p>
        <p className="mt-3">
          <strong>L&apos;indice de proximité est prudent.</strong> Il va de −100 à +100. On divise le total des accords et
          désaccords par la somme des importances <em>augmentée de {K_PRUDENCE}</em>, comme si chaque candidat avait en
          plus trois questions d&apos;importance moyenne sans accord ni désaccord. Un résultat obtenu sur peu de questions
          est ainsi ramené vers zéro. Exemple, avec une importance moyenne partout : 3 accords sur 3 questions donnent
          6 ÷ (6 + {K_PRUDENCE}) = +50 ; 7 accords et 1 désaccord sur 8 questions donnent 12 ÷ (16 + {K_PRUDENCE}) = +55.
          Sans cette prudence, le premier (+100 %) serait passé devant le second (+75 %) alors qu&apos;on en sait bien
          moins sur lui. Le nombre de questions documentées est affiché sous chaque indice.
        </p>
        <p className="mt-3">
          <strong>L&apos;effet économique est une information séparée.</strong> À côté de chaque candidat s&apos;affiche
          l&apos;effet économique estimé de ses mesures sur votre catégorie (voir plus bas), calculé avec les thèmes de vos
          réponses. Il ne sert jamais au classement par proximité et n&apos;est jamais additionné à la proximité.
        </p>
        <p className="mt-3">
          <strong>Qui a écrit les questions.</strong> Les {QUESTIONS.length} questions ont été rédigées avec l&apos;aide
          d&apos;une IA et validées par le responsable du site, sans relecture extérieure à ce jour. Elles couvrent 11
          thèmes : l&apos;éducation et la défense s&apos;ajoutent aux 9 thèmes du score économique. Chaque formulation est
          un choix éditorial, et nous invitons à les contester (voir plus bas).
        </p>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Comment une position est établie</h2>
        <p>
          Une position (« ce candidat défend l&apos;option A ou B ») n&apos;est enregistrée que si elle découle{" "}
          <strong>directement</strong> d&apos;une mesure déjà recensée et sourcée. Nous ne déduisons jamais une position de
          l&apos;étiquette du parti, de la famille politique, d&apos;un vote ancien ou d&apos;une absence de déclaration ;
          une position vague ou ambiguë reste vide. La recherche porte avec la même attention sur les deux options de
          chaque question, pour ne pas biaiser les données vers les propositions de changement. Le rattachement d&apos;une
          mesure à une option est une interprétation : c&apos;est pourquoi chaque position est relue avant publication et
          peut être contestée.
        </p>
        <p className="mt-3">
          <strong>Nous ne sollicitons pas les équipes de campagne.</strong> Les positions viennent uniquement de sources
          publiques, et chacune porte un niveau de validation affiché dans le détail du résultat :
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-1.5">
          <li>
            <strong>Programme ou site officiel</strong> ({validations.officielle}) : la position figure dans le programme
            publié par le candidat ou son parti, consulté directement. C&apos;est la source privilégiée dès qu&apos;un
            programme est publié.
          </li>
          <li>
            <strong>Recoupée par plusieurs médias</strong> ({validations.recoupee}) : au moins deux médias de référence
            indépendants rapportent la même position.
          </li>
          <li>
            <strong>Source unique, à recouper</strong> ({validations.unique}) : une seule source de presse à ce jour. La
            position compte dans le calcul, mais elle est signalée et doit être confirmée par une deuxième source.
          </li>
        </ul>
        <details className="mt-6 rounded-xl bg-paper-deep/60 px-5 py-4">
          <summary className="cursor-pointer font-display text-[0.95rem] font-medium text-ink">
            Couverture de chaque question : combien de candidats de chaque côté
          </summary>
          <p className="text-[0.9rem] text-ink-soft mt-3 mb-3">
            Une question sans position ne change rien au résultat ; une question où tous les candidats documentés sont du
            même côté ne les départage pas. Ce tableau permet de le vérifier.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.88rem]">
              <thead className="font-display text-[0.8rem] text-ink-soft">
                <tr>
                  <th scope="col" className="py-1.5 pr-3 font-medium">N°</th>
                  <th scope="col" className="py-1.5 pr-3 font-medium">Thème</th>
                  <th scope="col" className="py-1.5 pr-3 font-medium">Option A</th>
                  <th scope="col" className="py-1.5 font-medium">Option B</th>
                </tr>
              </thead>
              <tbody>
                {couverture.map(({ question, a, b }) => (
                  <tr key={question.id} className="border-t border-line align-top">
                    <td className="py-1.5 pr-3 tabular-nums">{question.id}</td>
                    <td className="py-1.5 pr-3">{question.theme}</td>
                    <td className="py-1.5 pr-3">
                      <span className="tabular-nums font-medium">{a}</span>{" "}
                      <span className="text-ink-faint">· {question.a}</span>
                    </td>
                    <td className="py-1.5">
                      <span className="tabular-nums font-medium">{b}</span>{" "}
                      <span className="text-ink-faint">· {question.b}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Comment une mesure est notée</h2>
        <p>
          Pour chacune des quatre catégories (classes populaires, moyennes, aisées, retraités et inactifs), une mesure
          reçoit un score de -2 à +2 (utilisé pour le volet « effet économique estimé sur votre catégorie ») : une <strong>estimation de l&apos;effet économique direct</strong> sur le niveau
          de vie de la catégorie (-2 : effet nettement défavorable ; 0 : neutre ou indéterminé ; +2 : effet nettement
          favorable), accompagnée des avantages et des risques documentés et d&apos;un « angle mort » : ce que la mesure
          ou son chiffrage ne permettent pas de conclure. Un effet seulement possible, indirect ou non chiffré vaut 0. Le même barème s&apos;applique à tous les candidats,
          quelle que soit leur famille politique. Cette notation reste une estimation, pas une mesure.
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
          <strong>Les programmes officiels d&apos;abord.</strong> Dès qu&apos;un candidat publie son programme, il devient
          la source de référence : nous le lisons directement sur son site de campagne ou celui de son parti, et nous
          citons la phrase exacte. C&apos;est le cas aujourd&apos;hui pour le programme de Jean-Luc Mélenchon, publié le 6
          novembre 2026.
        </p>
        <p className="mt-3">
          <strong>Sinon, la presse de référence, recoupée.</strong> La recherche est volontairement limitée à quatre
          médias (franceinfo, Le JDD, LCP, France 24), pour éviter les sites agrégateurs de fiabilité non vérifiée, et
          nous cherchons une deuxième source indépendante pour chaque position. Ce choix a un coût que nous assumons :
          certains médias ne peuvent pas être consultés par l&apos;outil, et ce périmètre n&apos;est pas un panel
          pluraliste garanti de la presse française.
        </p>
        <p className="mt-3">
          Les comparateurs de think tanks (par exemple celui de la Fondation iFRAP) peuvent servir de simple piste pour
          savoir où chercher. Ils ne sont jamais une source : aucune mesure ni position n&apos;est reprise d&apos;eux.
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
            <strong>Une notation faite par une IA,</strong> susceptible de biais et d&apos;erreurs, même si une
            relecture humaine précède désormais chaque mise à jour.
          </li>
          <li>
            <strong>Des choix éditoriaux</strong> qui ne sont pas neutres par nature : le choix des 9 thèmes, des
            4 catégories sociales et des seuils de classement (déciles de l&apos;Insee).
          </li>
          <li>
            <strong>Une couverture inégale des positions.</strong> Seuls {classables} candidats sur {CANDIDATS.length}{" "}
            ont au moins {SEUIL_COUVERTURE} positions documentées et peuvent être classés par la boussole ; les autres ne
            sont pas moins proches de vos choix, leurs positions ne sont simplement pas (encore) documentées.
          </li>
          <li>
            <strong>Des choix binaires et des questions limitées.</strong> Deux options simplifient des positions
            nuancées, et {QUESTIONS.length} questions ne couvrent pas tout ce qu&apos;un candidat défend (ni le logement,
            la laïcité, la fin de vie, l&apos;agriculture…).
          </li>
          <li>
            <strong>Le volet économique ne mesure que l&apos;effet économique direct</strong> sur la catégorie, pas les
            valeurs, et c&apos;est une moyenne de catégorie : l&apos;effet sur un foyer précis peut différer (par exemple selon
            la composition du foyer ou le niveau de salaire).
          </li>
          <li>
            <strong>Aucun résultat n&apos;est une recommandation de vote.</strong>
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
