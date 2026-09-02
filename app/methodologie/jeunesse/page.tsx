import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMIC jeunes et RSA sous 25 ans : le cadre légal",
  description:
    "Abattement Smic jeunes, condition d'âge du RSA : cadre légal actuel, le \"trou\" 18-25 ans, et arguments pour et contre les propositions des candidats.",
  alternates: { canonical: "/methodologie/jeunesse" },
};

export default function JeunessePage() {
  return (
    <div className="max-w-[820px] mx-auto px-6 pt-8 pb-20">
      <div className="font-mono text-[0.8rem] uppercase tracking-wide text-ink-soft mb-2">
        Fiche méthodologique dédiée
      </div>
      <h1 className="text-[2rem] mb-2">SMIC jeunes et RSA sous 25 ans</h1>
      <p className="text-ink-soft">
        Un salaire minimum minoré pour les mineurs, et un accès restreint au RSA avant 25 ans : deux règles qui
        traitent les jeunes différemment du reste de la population active. Cadre légal actuel, puis arguments des
        deux côtés, sans les départager.
      </p>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">1. Le cadre légal actuel — Smic jeunes</h2>
        <p>Smic horaire brut : 12,31 € depuis le 1ᵉʳ juin 2026. Abattement légal, facultatif pour l&apos;employeur :</p>
        <table className="w-full text-[0.85rem] border-collapse mt-3">
          <tbody>
            <tr><td className="py-2 border-b border-line font-semibold">&lt; 17 ans, &lt; 6 mois d&apos;expérience dans la branche</td><td className="py-2 border-b border-line">80 % — 9,85 €/h</td></tr>
            <tr><td className="py-2 border-b border-line font-semibold">17-18 ans, &lt; 6 mois d&apos;expérience</td><td className="py-2 border-b border-line">90 % — 11,08 €/h</td></tr>
            <tr><td className="py-2 font-semibold">18 ans ou plus, ou 6 mois acquis</td><td className="py-2">100 % — 12,31 €/h</td></tr>
          </tbody>
        </table>
        <p className="text-[0.85rem] text-ink-soft mt-3">
          Régime distinct des apprentis/contrats de professionnalisation (barème croisant âge et année de contrat, de
          27 % à 78 % ou plus du Smic). Source : Code du travail art. D. 3231-3 s. ; barèmes Urssaf/DGT.
        </p>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">2. Le cadre légal actuel — RSA et âge</h2>
        <table className="w-full text-[0.85rem] border-collapse">
          <tbody>
            <tr><td className="py-2 border-b border-line font-semibold">RSA classique</td><td className="py-2 border-b border-line">25 ans ou plus, sans condition d&apos;activité</td></tr>
            <tr><td className="py-2 border-b border-line font-semibold">Parent isolé / enceinte</td><td className="py-2 border-b border-line">Aucune condition d&apos;âge ni d&apos;activité</td></tr>
            <tr><td className="py-2 font-semibold">RSA jeune actif</td><td className="py-2">18-24 ans, 3 214 h travaillées sur 3 ans</td></tr>
          </tbody>
        </table>
        <p className="mt-3">
          Montant forfaitaire personne seule : 651,69 €/mois (avril 2026), identique quelle que soit la voie d&apos;accès.
        </p>
        <p className="text-[0.85rem] text-ink-soft mt-2">
          Source : Code de l&apos;action sociale et des familles art. L262-2 s. ; montants Caf/MSA.
        </p>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">3. Un angle mort structurel : le « trou » 18-25 ans</h2>
        <p>
          Un jeune de 18 à 24 ans, non étudiant, sans les 3 214 heures requises pour le RSA jeune actif, et sans
          droits ouverts à l&apos;assurance chômage, ne peut prétendre ni au RSA classique, ni au RSA jeune actif, ni
          au chômage. La Garantie jeunes couvre une partie de ce public, avec un montant plus faible (~535 €) et un
          accompagnement contraignant — ce n&apos;est pas un équivalent strict du RSA. Toute mesure sur « les minima
          sociaux des jeunes » doit préciser quel levier elle actionne : âge, condition d&apos;activité, ou montant.
        </p>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">4. Argumentaire — l&apos;abattement Smic jeunes</h2>
        <div className="grid gap-px bg-line" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#326049" }}>Pour le maintien</div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Réduit le coût d&apos;embauche d&apos;un jeune sans expérience</li>
              <li>Reflète une productivité initiale plus faible, selon ses défenseurs</li>
              <li>Facultatif : un employeur peut payer le taux plein dès l&apos;embauche</li>
            </ul>
          </div>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#8f382f" }}>Pour la suppression</div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Perçu comme une discrimination par l&apos;âge à travail identique</li>
              <li>L&apos;écart disparaît après 6 mois : effet incitatif limité dans le temps</li>
              <li>Risque de précarisation des jeunes sans soutien familial</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-line">
        <h2 className="text-[1.2rem] mb-5">5. Argumentaire — la condition d&apos;âge du RSA</h2>
        <div className="grid gap-px bg-line" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#326049" }}>Pour maintenir 25 ans</div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Le RSA vise des personnes déjà installées dans la vie active ; les 18-24 ans relèveraient de dispositifs jeunesse dédiés</li>
              <li>Crainte d&apos;une désincitation aux études ou à l&apos;insertion rapide</li>
              <li>Coût budgétaire d&apos;une ouverture sans condition à une classe d&apos;âge nombreuse</li>
            </ul>
          </div>
          <div className="bg-paper-raised p-4.5">
            <div className="font-mono text-[0.72rem] uppercase mb-2" style={{ color: "#8f382f" }}>Pour l&apos;ouvrir dès 18 ans</div>
            <ul className="list-disc pl-4.5 text-[0.9rem]">
              <li>Incohérence de statut : majeur pour les devoirs, exclu d&apos;un minimum social avant 25 ans</li>
              <li>Rapports associatifs (CNLE) documentant une pauvreté élevée chez les 18-24 ans non couverts</li>
              <li>La condition des 3 214 heures exclut par construction les jeunes les plus précaires</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-[1.2rem] mb-5">6. Sources</h2>
        <ul className="list-disc pl-4.5 text-[0.9rem]">
          <li>Code du travail — art. D. 3231-3 s. (Smic minoré des jeunes salariés)</li>
          <li>Code de l&apos;action sociale et des familles — art. L262-2 s. (conditions du RSA)</li>
          <li>Urssaf / Direction générale du travail — barèmes Smic en vigueur</li>
          <li>Caf / MSA — montants forfaitaires du RSA</li>
          <li>Conseil national des politiques de lutte contre la pauvreté et l&apos;exclusion sociale (CNLE)</li>
        </ul>
        <p className="text-[0.82rem] text-ink-soft mt-3">
          À réviser à chaque revalorisation du Smic et à chaque loi de finances modifiant les montants ou conditions
          du RSA.
        </p>
      </section>
    </div>
  );
}
