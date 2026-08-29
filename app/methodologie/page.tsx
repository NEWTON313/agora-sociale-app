export default function MethodologiePage() {
  return (
    <div className="max-w-[820px] mx-auto px-6 pt-8 pb-20">
      <h1 className="text-[2rem] mb-2">Comment nous construisons chaque analyse</h1>
      <p className="text-ink-soft">
        La crédibilité de L&apos;Agora Sociale repose entièrement sur la traçabilité de ses sources et sur la
        séparation stricte entre le fait et l&apos;interprétation.
      </p>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">1. Collecte des données</h2>
        <p>
          Chaque mesure est saisie uniquement à partir du texte du programme officiel du candidat, ou d&apos;une
          déclaration publique vérifiable. Chaque fiche contient un lien vers la source d&apos;origine et une double
          relecture est requise avant publication.
        </p>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">2. Le score d&apos;impact par classe</h2>
        <p>
          Score de -2 à +2, jamais un jugement de valeur : une estimation de l&apos;effet économique direct sur le
          niveau de vie de la catégorie, avec un champ <strong>« angle mort »</strong> systématique pour ce que la
          mesure ou son chiffrage ne permettent pas de conclure.
        </p>
      </section>

      <section id="simulateur" className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">3. Le simulateur de classement</h2>
        <p>
          Reproduit le <strong>niveau de vie</strong> INSEE (revenu du foyer ÷ unités de consommation). Seuils basés
          sur les déciles INSEE 2024 (publiés le 09/07/2026) :
        </p>
        <table className="w-full text-[0.9rem] mt-3 border-collapse">
          <thead>
            <tr className="font-mono text-[0.72rem] uppercase text-ink-soft">
              <th className="text-left py-2 border-b border-line">Catégorie</th>
              <th className="text-left py-2 border-b border-line">Seuil / UC / an</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-2 border-b border-line">Classes populaires</td><td className="py-2 border-b border-line">&lt; 20 980 €</td></tr>
            <tr><td className="py-2 border-b border-line">Classes moyennes</td><td className="py-2 border-b border-line">20 980 € à 38 780 €</td></tr>
            <tr><td className="py-2 border-b border-line">Classes aisées</td><td className="py-2 border-b border-line">&gt; 38 780 €</td></tr>
          </tbody>
        </table>
        <p className="text-[0.85rem] text-ink-soft mt-3">
          Table à remplacer chaque année lors de la publication INSEE suivante — voir{" "}
          <code className="font-mono">lib/simulateur.ts</code>.
        </p>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">4. Fiscalité du patrimoine (IFI, succession)</h2>
        <p>
          Ces mesures étant particulièrement sensibles et sujettes à débat, elles font l&apos;objet d&apos;une fiche
          méthodologique dédiée, présentant le cadre légal actuel et les arguments des deux côtés du débat.
        </p>
        <a href="/methodologie/fiscalite-patrimoine" className="underline font-mono text-[0.85rem]">
          Voir la fiche « Fiscalité du patrimoine » →
        </a>
      </section>

      <section className="py-8">
        <h2 className="text-[1.2rem] mb-5">5. Réforme des retraites</h2>
        <p>
          Le calendrier de l&apos;âge légal a été suspendu fin 2025 et reste incertain au-delà de 2028 : cette fiche
          pose le cadre légal actuel et l&apos;angle mort le plus souvent oublié — l&apos;écart d&apos;espérance de
          vie et de temps réellement passé à la retraite entre catégories socioprofessionnelles.
        </p>
        <a href="/methodologie/retraites" className="underline font-mono text-[0.85rem]">
          Voir la fiche « Réforme des retraites » →
        </a>
      </section>

      <section className="py-8">
        <h2 className="text-[1.2rem] mb-5">6. SMIC jeunes et RSA sous 25 ans</h2>
        <p>
          Ces deux règles liées à l&apos;âge laissent un « trou » spécifique entre 18 et 25 ans dans le filet de
          sécurité sociale. Cette fiche pose le cadre légal actuel et les arguments pour et contre l&apos;abattement
          jeunes du Smic et la condition d&apos;âge du RSA.
        </p>
        <a href="/methodologie/jeunesse" className="underline font-mono text-[0.85rem]">
          Voir la fiche « Jeunesse, emploi, solidarité » →
        </a>
      </section>
    </div>
  );
}
