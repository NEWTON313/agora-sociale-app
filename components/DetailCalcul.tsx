import Link from "next/link";
import { CLASSES_SOCIALES } from "@/lib/data";
import { SEUILS_CLASSIFICATION, SEUILS_NIVEAU_DE_VIE, type ResultatClassement } from "@/lib/simulateur";

const euros = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " €";
const nombre = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(n);

/** Classe donnée par le seul niveau de vie, avant ajustement du patrimoine ou du statut. */
function classeParNiveauDeVie(niveauDeVie: number) {
  if (niveauDeVie < SEUILS_CLASSIFICATION.populairesMax) return "populaires" as const;
  if (niveauDeVie < SEUILS_CLASSIFICATION.moyennesMax) return "moyennes" as const;
  return "aisees" as const;
}

/**
 * Volet repliable « Comment ce résultat est-il calculé ? » : reprend, avec les chiffres de l'utilisateur,
 * chaque étape du classement (revenu annuel, unités de consommation, niveau de vie, seuils, ajustements).
 */
export default function DetailCalcul({ r }: { r: ResultatClassement }) {
  const nomClasse = (id: string) => CLASSES_SOCIALES.find((c) => c.id === id)!.nom;
  const classeNiveau = classeParNiveauDeVie(r.niveauDeVie);
  const { populairesMax, moyennesMax, patrimoineBumpAisees } = SEUILS_CLASSIFICATION;

  // Frontière la plus proche du niveau de vie (pour dire à quel point le classement est « serré »).
  const seuilProche =
    classeNiveau === "populaires"
      ? populairesMax
      : classeNiveau === "aisees"
        ? moyennesMax
        : r.niveauDeVie - populairesMax < moyennesMax - r.niveauDeVie
          ? populairesMax
          : moyennesMax;
  const ecart = Math.abs(r.niveauDeVie - seuilProche);
  const ecartPct = Math.round((ecart / seuilProche) * 100);
  const auDessus = r.niveauDeVie >= seuilProche;

  const termesUC = [
    "1 (premier adulte)",
    r.nbAdultes > 1 ? `${r.nbAdultes - 1} × 0,5 (adulte${r.nbAdultes > 2 ? "s" : ""} supplémentaire${r.nbAdultes > 2 ? "s" : ""})` : null,
    r.nbEnfants14Plus > 0 ? `${r.nbEnfants14Plus} × 0,5 (enfant${r.nbEnfants14Plus > 1 ? "s" : ""} de 14 ans ou plus)` : null,
    r.nbEnfantsMoins14 > 0 ? `${r.nbEnfantsMoins14} × 0,3 (enfant${r.nbEnfantsMoins14 > 1 ? "s" : ""} de moins de 14 ans)` : null,
  ].filter((t): t is string => t !== null);

  const lignesSeuils: { classe: "populaires" | "moyennes" | "aisees"; libelle: string }[] = [
    { classe: "populaires", libelle: `moins de ${euros(populairesMax)}` },
    { classe: "moyennes", libelle: `de ${euros(populairesMax)} à moins de ${euros(moyennesMax)}` },
    { classe: "aisees", libelle: `${euros(moyennesMax)} et plus` },
  ];

  return (
    <details className="group mt-5 rounded-xl border border-line bg-paper-deep/50 px-5 py-4">
      <summary className="cursor-pointer font-display text-[0.95rem] font-medium text-ink">
        Comment ce résultat est-il calculé ?
      </summary>

      <ol className="mt-4 flex list-decimal flex-col gap-4 pl-5 text-[0.95rem] leading-relaxed text-ink-soft marker:font-display marker:font-medium">
        <li>
          <strong className="font-medium text-ink">Revenu annuel du foyer.</strong> Votre revenu mensuel saisi, multiplié
          par 12 : <span className="whitespace-nowrap font-medium text-ink">{euros(r.revenuAnnuel)}</span> par an.
        </li>
        <li>
          <strong className="font-medium text-ink">Unités de consommation (UC).</strong> L&apos;échelle de l&apos;Insee
          pondère la composition du foyer : {termesUC.join(" + ")} ={" "}
          <span className="whitespace-nowrap font-medium text-ink">{nombre(r.uc)} UC</span>.
        </li>
        <li>
          <strong className="font-medium text-ink">Niveau de vie.</strong> {euros(r.revenuAnnuel)} ÷ {nombre(r.uc)} UC ={" "}
          <span className="whitespace-nowrap font-medium text-ink">{euros(r.niveauDeVie)} par an et par UC</span>.
        </li>
        <li>
          <strong className="font-medium text-ink">Comparaison aux seuils Insee</strong> (déciles du niveau de vie,
          données {SEUILS_NIVEAU_DE_VIE.anneeSource}) :
          <ul className="mt-2 flex flex-col gap-1.5">
            {lignesSeuils.map((l) => (
              <li
                key={l.classe}
                className={`rounded-md px-3 py-1.5 ${
                  l.classe === classeNiveau ? "bg-paper-raised font-medium text-ink shadow-card" : ""
                }`}
              >
                {nomClasse(l.classe)} : {l.libelle}
                {l.classe === classeNiveau && <span className="font-display text-[0.82rem]"> ← votre niveau de vie</span>}
              </li>
            ))}
          </ul>
          <span className="mt-2 block">
            Votre niveau de vie est à {euros(ecart)} (environ {ecartPct} %) {auDessus ? "au-dessus" : "en dessous"} du
            seuil de {euros(seuilProche)}. Les seuils sont des repères statistiques : un foyer proche d&apos;une
            frontière pourrait relever de l&apos;une ou l&apos;autre catégorie.
          </span>
        </li>
        <li>
          <strong className="font-medium text-ink">Ajustements.</strong>{" "}
          {r.bumpPatrimoine ? (
            <>
              Votre patrimoine net déclaré atteint {euros(patrimoineBumpAisees)} : un foyer des classes moyennes passe
              alors en classes aisées.
            </>
          ) : r.estRetraiteOuInactif ? (
            <>
              Votre statut (retraité·e, chômage, études ou autre situation sans emploi) vous place dans la catégorie «{" "}
              {nomClasse("retraites")} » quel que soit le niveau de vie ; le niveau de vie seul vous aurait classé·e en «{" "}
              {nomClasse(r.classeRevenuSecondaire)} ».
            </>
          ) : (
            <>
              Aucun : ni le statut ni le patrimoine n&apos;ont modifié ce classement. (Le patrimoine n&apos;intervient que
              pour un foyer des classes moyennes, à partir de {euros(patrimoineBumpAisees)} ; le statut seulement pour
              les retraité·es et inactifs·ves.)
            </>
          )}
        </li>
      </ol>

      <p className="mt-4 text-[0.85rem] text-ink-soft">
        La position dans la population ({r.percentile}ᵉ percentile) est estimée par interpolation entre les déciles de
        l&apos;Insee. L&apos;année de naissance ne sert qu&apos;aux repères sur la retraite. Détail des sources :{" "}
        <Link href="/methodologie#simulateur" className="underline underline-offset-4">
          méthodologie du simulateur
        </Link>
        .
      </p>
    </details>
  );
}
