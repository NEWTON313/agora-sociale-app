import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réforme des retraites 2027 : cadre légal et enjeux",
  description:
    "Suspension de la réforme Borne, calendrier gelé jusqu'en 2028 : cadre légal actuel, angle mort sur l'espérance de vie par catégorie, arguments pour et contre.",
  alternates: { canonical: "/methodologie/retraites" },
};

export default function RetraitesPage() {
  return (
    <div className="max-w-[820px] mx-auto px-6 pt-8 pb-20">
      <div className="font-mono text-[0.8rem] uppercase tracking-wide text-ink-soft mb-2">
        Fiche méthodologique dédiée
      </div>
      <h1 className="text-[2rem] mb-2">La réforme des retraites</h1>
      <p className="text-ink-soft">
        La réforme de 2023 a été suspendue fin 2025 ; l&apos;issue de cette suspension sera directement tranchée par
        l&apos;élection de 2027. Cette fiche pose le cadre légal actuel puis restitue les arguments des deux côtés du
        débat sans les départager.
      </p>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">1. Le cadre légal actuel</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.85rem] border-collapse min-w-[560px]">
            <thead>
              <tr className="font-mono text-[0.68rem] uppercase text-ink-soft text-left">
                <th className="py-2 border-b border-line pr-3">Paramètre</th>
                <th className="py-2 border-b border-line pr-3">Avant 2023 (Touraine)</th>
                <th className="py-2 border-b border-line pr-3">Réforme 2023 (Borne)</th>
                <th className="py-2 border-b border-line">Depuis LFSS 2026</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2.5 border-b border-line pr-3 font-semibold">Âge légal</td>
                <td className="py-2.5 border-b border-line pr-3">62 ans, fixe</td>
                <td className="py-2.5 border-b border-line pr-3">Vers 64 ans (+3 mois/génération), atteint pour la génération 1968</td>
                <td className="py-2.5 border-b border-line">Gelé à 62 ans 9 mois ; 64 ans reporté à la génération 1969</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-semibold">Durée de cotisation</td>
                <td className="py-2.5 pr-3">172 trimestres pour la génération 1973 (2035)</td>
                <td className="py-2.5 pr-3">172 trimestres dès la génération 1965 (2027)</td>
                <td className="py-2.5">Gelée à 170 trimestres ; 172 reporté à la génération 1966</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          La LFSS pour 2026, promulguée le 30 décembre 2025 après validation du Conseil constitutionnel, gèle le
          calendrier — elle ne l&apos;annule pas. Le gel s&apos;applique aux pensions prenant effet à compter du
          1ᵉʳ septembre 2026 et doit prendre fin le 1ᵉʳ janvier 2028, sauf nouvelle loi : la décision finale revient
          donc aux vainqueurs de l&apos;élection de 2027.
        </p>
        <p className="text-[0.85rem] text-ink-soft mt-3">
          Non concernés par ce gel : carrières longues, minimum contributif à 85 % du Smic net, compte pénibilité,
          extinction progressive de certains régimes spéciaux — ces volets de 2023 restent en vigueur.
        </p>

        <h3 className="text-[1rem] mt-6 mb-2.5">Le barème par génération, aujourd&apos;hui</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.85rem] border-collapse min-w-[480px]">
            <thead>
              <tr className="font-mono text-[0.68rem] uppercase text-ink-soft text-left">
                <th className="py-2 border-b border-line pr-3">Naissance</th>
                <th className="py-2 border-b border-line pr-3">Âge légal</th>
                <th className="py-2 border-b border-line pr-3">Trimestres</th>
                <th className="py-2 border-b border-line">Statut</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1960 et avant", "62 ans", "168", "Définitif"],
                ["1961", "62 ans et 3 mois", "169", "Définitif"],
                ["1962", "62 ans et 6 mois", "169", "Définitif"],
                ["1963", "62 ans et 9 mois", "170", "Définitif"],
                ["1964", "62 ans et 9 mois", "170", "Gelé (LFSS 2026)"],
                ["1965 (janv.–mars)", "62 ans et 9 mois", "170", "Gelé (LFSS 2026)"],
                ["1965 (avril–déc.)", "63 ans", "171", "Gelé (LFSS 2026)"],
                ["1966", "63 ans et 3 mois", "172", "Gelé (LFSS 2026)"],
                ["1967", "63 ans et 6 mois", "172", "Gelé (LFSS 2026)"],
                ["1968", "63 ans et 9 mois", "172", "Gelé (LFSS 2026)"],
                ["1969 et après", "64 ans", "172", "Incertain — enjeu 2027"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i} className="py-1.5 border-b border-line pr-3">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[0.82rem] text-ink-soft mt-3">
          Source : Service-public.fr / DILA (Premier ministre), 27/02/2026, appliquant la loi n° 2025-1403 du
          30/12/2025 au calendrier de la loi n° 2023-270 du 14/04/2023. Tableau simplifié (régime général) — pour un
          calcul individuel exact, orienter vers{" "}
          <a href="https://www.info-retraite.fr" className="underline">info-retraite.fr</a>. Le{" "}
          <a href="/simulateur" className="underline">simulateur</a> utilise ce même barème.
        </p>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">2. L&apos;angle mort structurel</h2>
        <p>
          Un même âge légal ne recouvre pas la même réalité selon la catégorie socioprofessionnelle :
        </p>
        <ul className="list-disc pl-4.5 mt-2">
          <li>
            <strong>Espérance de vie</strong> — à 35 ans, un homme cadre vit en moyenne 5,3 ans de plus qu&apos;un
            homme ouvrier (Insee, 2020-2022) ; 3,4 ans chez les femmes.
          </li>
          <li>
            <strong>Temps réellement passé à la retraite</strong> — malgré un départ souvent plus précoce, un ouvrier
            a une espérance de retraite sans incapacité d&apos;environ 9,3 ans contre 14,2 ans pour un cadre
            (Blasco &amp; Lojkine, Insee/Ined).
          </li>
          <li>
            <strong>Effet différencié selon le genre</strong> — carrières hachées et temps partiel réduisent
            davantage le montant des pensions féminines que ne le fait l&apos;âge légal en lui-même.
          </li>
        </ul>
        <p className="mt-3">
          Une mesure « neutre » sur l&apos;âge légal n&apos;a donc pas un effet neutre entre classes sociales : toute
          fiche sur les retraites doit distinguer l&apos;effet sur le <em>montant</em> de la pension de l&apos;effet
          sur le <em>temps</em> réellement vécu à la retraite.
        </p>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">3. Argumentaire — report de l&apos;âge légal</h2>
        <div className="grid gap-px bg-line" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#326049" }}>
              Arguments pour le report
            </div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Dégradation du ratio actifs/retraités avec le vieillissement démographique</li>
              <li>Âge légal français parmi les plus bas de l&apos;OCDE</li>
              <li>Besoins de financement identifiés par le COR à moyen terme</li>
              <li>Maintien en emploi des seniors, jugé favorable à l&apos;activité</li>
            </ul>
          </div>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#8f382f" }}>
              Arguments contre le report
            </div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Espérance de vie en bonne santé inégale selon la pénibilité du métier</li>
              <li>Une partie des seniors est déjà hors emploi avant l&apos;âge légal (coût reporté sur chômage/RSA)</li>
              <li>Femmes aux carrières hachées davantage pénalisées par la durée de cotisation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">4. Argumentaire — la suspension (LFSS 2026)</h2>
        <div className="grid gap-px bg-line" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#326049" }}>
              Arguments pour la suspension
            </div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Réponse à une contestation sociale durable et à une Assemblée recomposée</li>
              <li>Fenêtre de renégociation avec les partenaires sociaux</li>
              <li>Bénéficie en priorité aux générations les plus proches du départ</li>
            </ul>
          </div>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#8f382f" }}>
              Arguments contre la suspension
            </div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Coût budgétaire supplémentaire, chiffré par le COR et la Cour des comptes</li>
              <li>Incertitude prolongée pour les générations non encore fixées</li>
              <li>Critique d&apos;un gel qui « reporte le problème » plutôt qu&apos;il ne le résout</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-[1.2rem] mb-5">5. Sources</h2>
        <ul className="list-disc pl-4.5 text-[0.9rem]">
          <li>Loi n° 2023-270 du 14 avril 2023 (réforme dite « Borne »)</li>
          <li>Loi de financement de la Sécurité sociale pour 2026, promulguée le 30 décembre 2025</li>
          <li>Conseil d&apos;orientation des retraites (COR) — rapports annuels</li>
          <li>Insee Première n° 2005 — écarts d&apos;espérance de vie cadres/ouvriers</li>
          <li>Blasco &amp; Lojkine (Insee/Ined) — durée de retraite selon la catégorie sociale</li>
          <li>Cour des comptes — rapports sur le financement du système de retraites</li>
        </ul>
        <p className="text-[0.82rem] text-ink-soft mt-3">
          Calendrier générationnel complet (fonction publique catégorie active, régimes spéciaux, carrières longues)
          volontairement simplifié ici pour rester lisible — orienter l&apos;utilisateur vers le simulateur officiel
          de l&apos;Assurance retraite pour un calcul individuel. À réviser après le 1ᵉʳ janvier 2028.
        </p>
      </section>
    </div>
  );
}
