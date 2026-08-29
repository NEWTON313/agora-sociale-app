export default function FiscalitePatrimoinePage() {
  return (
    <div className="max-w-[820px] mx-auto px-6 pt-8 pb-20">
      <div className="font-mono text-[0.8rem] uppercase tracking-wide text-ink-soft mb-2">
        Fiche méthodologique dédiée
      </div>
      <h1 className="text-[2rem] mb-2">Fiscalité du patrimoine : IFI et droits de succession</h1>
      <p className="text-ink-soft">
        Ces deux impôts concentrent une grande partie des désaccords de la campagne. Cette fiche pose d&apos;abord
        le cadre légal actuel, puis présente, sans les départager, les arguments de leurs partisans et de leurs
        critiques.
      </p>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">1. Le cadre légal actuel — IFI</h2>
        <table className="w-full text-[0.9rem] border-collapse">
          <tbody>
            <tr><td className="py-2 border-b border-line font-semibold">Seuil d&apos;entrée</td><td className="py-2 border-b border-line">Patrimoine immobilier net taxable &gt; 1 300 000 €</td></tr>
            <tr><td className="py-2 border-b border-line font-semibold">Début du calcul</td><td className="py-2 border-b border-line">Barème appliqué dès 800 000 € (seuls les patrimoines &gt; 1,3 M€ sont réellement imposés)</td></tr>
            <tr><td className="py-2 border-b border-line font-semibold">Barème</td><td className="py-2 border-b border-line">0,5 % · 0,7 % · 1 % · 1,25 % · 1,5 % selon la tranche, jusqu&apos;à 10 M€ et au-delà</td></tr>
            <tr><td className="py-2 border-b border-line font-semibold">Résidence principale</td><td className="py-2 border-b border-line">Abattement de 30 %</td></tr>
            <tr><td className="py-2 border-b border-line font-semibold">Plafonnement</td><td className="py-2 border-b border-line">IR + PS + CEHR + IFI ≤ 75 % des revenus</td></tr>
          </tbody>
        </table>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">2. Le cadre légal actuel — droits de succession</h2>
        <table className="w-full text-[0.9rem] border-collapse">
          <tbody>
            <tr><td className="py-2 border-b border-line font-semibold">Conjoint / PACS</td><td className="py-2 border-b border-line">Exonération totale</td></tr>
            <tr><td className="py-2 border-b border-line font-semibold">Enfant (ligne directe)</td><td className="py-2 border-b border-line">Abattement 100 000 €, barème 5 % à 45 %</td></tr>
            <tr><td className="py-2 border-b border-line font-semibold">Frère / sœur</td><td className="py-2 border-b border-line">Abattement 15 932 €, taux 35–45 %</td></tr>
            <tr><td className="py-2 border-b border-line font-semibold">Sans lien de parenté</td><td className="py-2 border-b border-line">Abattement 1 594 €, taux 60 %</td></tr>
          </tbody>
        </table>
        <p className="text-[0.85rem] text-ink-soft mt-3">
          Fait budgétaire à noter : ce barème n&apos;a pas été revalorisé depuis 2011, malgré une inflation cumulée
          supérieure à 25 % — soit un alourdissement progressif et silencieux, indépendant de toute réforme votée.
        </p>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">3. Un angle mort structurel</h2>
        <p>
          Le comparateur classe par <strong>revenu</strong>. L&apos;IFI et les successions portent sur le{" "}
          <strong>patrimoine</strong>. Le seuil « classes aisées » du simulateur (~38 780 €/an/UC) est très inférieur
          au seuil de l&apos;IFI (1,3 M€ de patrimoine). La quasi-totalité des personnes classées « aisées » par leur
          revenu ne sont pas redevables de l&apos;IFI — et inversement, un ménage modeste propriétaire en zone tendue
          peut l&apos;être sans en avoir les liquidités. Toute fiche traitant de ces sujets doit le rappeler.
        </p>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">4. Argumentaire — sans trancher</h2>
        <div className="grid gap-px bg-line" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#326049" }}>
              Arguments pour une fiscalité renforcée
            </div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Concentration du capital plus rapide que la croissance des revenus (argument « r &gt; g »)</li>
              <li>L&apos;héritage n&apos;est pas un revenu du mérite ; le taxer sert l&apos;égalité des chances</li>
              <li>Finance des services publics bénéficiant à toutes les catégories</li>
              <li>Le gel du barème depuis 2011 pourrait être corrigé en faveur des classes moyennes plutôt qu&apos;allégé en haut de barème</li>
            </ul>
          </div>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#8f382f" }}>
              Arguments pour un allègement
            </div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Risque d&apos;exil fiscal des contribuables les plus mobiles (ampleur débattue)</li>
              <li>Double imposition : le patrimoine provient souvent de revenus déjà taxés</li>
              <li>Problème de liquidité pour les successions immobilières ou d&apos;entreprises familiales</li>
              <li>Rendement budgétaire jugé modeste par certains travaux au regard de la complexité</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">5. Un point où les études divergent</h2>
        <p>
          L&apos;évaluation de la réforme ISF → IFI (2018) n&apos;a pas permis de conclure de façon définitive sur ses
          effets sur l&apos;investissement ou les départs/retours de contribuables fortunés. Des économistes défendent
          des lectures opposées de ces mêmes données. L&apos;Agora Sociale ne tranche pas ce débat empirique.
        </p>
      </section>

      <section className="py-8">
        <h2 className="text-[1.2rem] mb-5">6. Sources</h2>
        <ul className="list-disc pl-4.5 text-[0.9rem]">
          <li>Code général des impôts — art. 964–983 (IFI) et 777–779 (successions)</li>
          <li>Direction générale des Finances publiques — barèmes en vigueur</li>
          <li>France Stratégie — comité d&apos;évaluation des réformes de la fiscalité du capital</li>
          <li>Conseil d&apos;analyse économique — note sur la fiscalité des successions (2023)</li>
          <li>Thomas Piketty, <em>Le Capital au XXIe siècle</em>, pour l&apos;argument r &gt; g</li>
        </ul>
        <p className="text-[0.82rem] text-ink-soft mt-3">
          À revoir à chaque loi de finances susceptible de modifier ces barèmes.
        </p>
      </section>
    </div>
  );
}
