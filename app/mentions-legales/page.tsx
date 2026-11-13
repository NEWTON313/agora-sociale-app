import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de Mon Choix 2027 : site édité à titre non professionnel, hébergeur, signalement d'un contenu, données personnelles (aucun compte, aucun cookie, aucun stockage des réponses).",
  alternates: { canonical: "/mentions-legales" },
};

const DEPOT = "https://github.com/NEWTON313/agora-sociale-app";

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-[820px] mx-auto px-6 pt-16 pb-24">
      <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] mb-5">Mentions légales</h1>
      <p className="text-[1.2rem] leading-relaxed text-ink-soft">
        Qui publie ce site, qui l&apos;héberge, comment signaler un contenu et ce qu&apos;il advient de vos données.
      </p>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Éditeur</h2>
        <p>
          Mon Choix 2027 est édité à titre non professionnel par un particulier, sans but lucratif. Comme le permet la
          loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique pour les sites édités à titre
          non professionnel, l&apos;éditeur ne publie pas son identité ; seules les coordonnées de l&apos;hébergeur sont
          indiquées ci-dessous.
        </p>
        <p className="mt-3">
          Le site n&apos;est lié à aucun parti, candidat, média ou institution. Son financement et sa méthode de travail
          sont décrits sur la page{" "}
          <Link href="/transparence" className="underline underline-offset-4">
            Transparence
          </Link>
          .
        </p>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Hébergeur</h2>
        <address className="not-italic leading-relaxed">
          Vercel Inc.
          <br />
          440 N Barranca Ave #4133
          <br />
          Covina, CA 91723, États-Unis
          <br />
          <a href="https://vercel.com" className="underline underline-offset-4" rel="noopener noreferrer">
            vercel.com
          </a>
        </address>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Signaler un contenu, demander une correction</h2>
        <p>
          Toute personne (citoyen·ne, journaliste, candidat·e ou équipe de campagne) peut signaler une erreur, demander
          une correction ou exercer un droit de réponse en{" "}
          <a href={`${DEPOT}/issues/new`} className="underline underline-offset-4" rel="noopener noreferrer">
            ouvrant un signalement public
          </a>
          , idéalement avec une source. Les demandes et leur suite sont publiques, pour que chacun puisse vérifier
          qu&apos;elles sont traitées de la même façon quel que soit leur auteur.
        </p>
      </section>

      <section className="py-12 border-b border-line">
        <h2 className="text-[1.7rem] mb-6">Données personnelles</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Aucun compte, aucun cookie, aucun stockage de vos réponses.</strong> Le test (situation et choix) est
            calculé dans votre navigateur : rien n&apos;est envoyé au site ni conservé.
          </li>
          <li>
            <strong>Partage facultatif.</strong> Si vous créez une carte à partager, le lien ne contient que votre
            catégorie sociale et vos thèmes prioritaires, jamais vos revenus ni vos réponses.
          </li>
          <li>
            <strong>Mesure d&apos;audience.</strong> La fréquentation est mesurée de façon agrégée et anonyme (Vercel Web
            Analytics et Speed Insights), sans cookie ni profil individuel.
          </li>
          <li>
            <strong>Journaux techniques.</strong> Comme tout hébergeur, Vercel traite l&apos;adresse IP des visiteurs
            pour acheminer les pages et protéger le service.
          </li>
          <li>
            <strong>Aucune ressource tierce.</strong> Les polices et les scripts sont servis par le site lui-même.
          </li>
        </ul>
      </section>

      <section className="py-12">
        <h2 className="text-[1.7rem] mb-6">Contenus et réutilisation</h2>
        <p>
          Le code et les données du site sont publics, sous licence MIT :{" "}
          <a href={DEPOT} className="underline underline-offset-4" rel="noopener noreferrer">
            {DEPOT.replace("https://", "")}
          </a>
          . Les noms des candidats et des partis sont cités à des fins d&apos;information ; les mesures sont résumées à
          partir de sources publiques indiquées pour chacune. Ces résumés et les estimations d&apos;impact n&apos;engagent
          pas les candidats : voir la{" "}
          <Link href="/methodologie" className="underline underline-offset-4">
            méthodologie
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
