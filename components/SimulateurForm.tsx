"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CLASSES_SOCIALES } from "@/lib/data";
import {
  classerProfil,
  SEUILS_NIVEAU_DE_VIE,
  type ResultatClassement,
  type StatutActivite,
  type StatutBareme,
  type TrimestreNaissance,
} from "@/lib/simulateur";

const euros = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " €";

const COULEURS: Record<string, string> = {
  populaires: "#3d5a78",
  moyennes: "#566f4d",
  aisees: "#7a4258",
  retraites: "#9c7539",
};

function ReglePercentile({ percentile }: { percentile: number }) {
  const ticks = SEUILS_NIVEAU_DE_VIE.points.filter((p) => p.percentile > 0 && p.percentile < 100);
  return (
    <div className="my-5">
      <div
        className="relative h-3.5 border border-ink"
        style={{ background: "linear-gradient(to right, #3d5a78, #566f4d 45%, #7a4258)" }}
        role="img"
        aria-label={`Votre niveau de vie se situe autour du ${percentile}e percentile de la population`}
      >
        {ticks.map((t) => (
          <div key={t.percentile} className="absolute top-0 bottom-0 w-px bg-white/60" style={{ left: `${t.percentile}%` }} />
        ))}
        <div className="absolute -top-2.5 w-0.5 h-[34px] bg-ink" style={{ left: `${percentile}%`, transform: "translateX(-50%)" }}>
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] uppercase bg-ink text-white px-1.5 py-0.5 whitespace-nowrap">
            Vous
          </div>
        </div>
      </div>
      <div className="flex justify-between font-mono text-[0.68rem] text-ink-soft mt-1.5">
        <span>D1 (10 % les plus modestes)</span>
        <span>Médiane</span>
        <span>D9 (10 % les plus aisés)</span>
      </div>
    </div>
  );
}

const STYLES_BAREME: Record<StatutBareme, { label: string; couleur: string }> = {
  definitif: { label: "Paramètre stable", couleur: "#454e5e" },
  gele: { label: "Vous bénéficiez du gel LFSS 2026", couleur: "#326049" },
  incertain: { label: "Paramètre incertain — enjeu de 2027", couleur: "#8f382f" },
};

function RepereRetraiteBlock({ r }: { r: ResultatClassement }) {
  if (!r.repereRetraite) return null;
  const { ageLegal, trimestres, statut, note } = r.repereRetraite;
  const style = STYLES_BAREME[statut];
  return (
    <div className="text-[0.9rem] bg-paper px-3.5 py-3 mt-4" style={{ borderLeft: `3px solid ${style.couleur}` }}>
      <div className="font-mono text-[0.68rem] uppercase tracking-wide mb-1" style={{ color: style.couleur }}>
        {style.label}
      </div>
      <strong>Repère retraite (indicatif) :</strong> à droit constant aujourd&apos;hui, votre âge légal de départ
      serait <strong>{ageLegal}</strong>, avec <strong>{trimestres} trimestres</strong> requis pour le taux plein.
      {note && <div className="mt-1.5 text-[0.85rem]">{note}</div>}
      <div className="mt-2">
        <Link href="/methodologie/retraites" className="font-mono text-[0.8rem] underline">
          Comprendre le calendrier complet et ses enjeux pour 2027 →
        </Link>
      </div>
    </div>
  );
}

function ReperesJeunesseBlock({ r }: { r: ResultatClassement }) {
  if (!r.reperesJeunesse.length) return null;
  return (
    <>
      {r.reperesJeunesse.map((repere, i) => (
        <div key={i} className="text-[0.9rem] bg-paper px-3.5 py-3 mt-4" style={{ borderLeft: "3px solid #3d5a78" }}>
          <strong>{repere.titre}</strong>
          <div className="mt-1.5 text-[0.85rem]">{repere.texte}</div>
          <div className="mt-2">
            <Link href="/methodologie/jeunesse" className="font-mono text-[0.8rem] underline">
              Comprendre le cadre légal et le débat →
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}

function Resultat({ r }: { r: ResultatClassement }) {
  const classe = CLASSES_SOCIALES.find((c) => c.id === r.classePrincipale)!;
  const classeRevenu = CLASSES_SOCIALES.find((c) => c.id === r.classeRevenuSecondaire)!;
  const couleur = COULEURS[classe.id];

  return (
    <div className="mt-8 p-6 bg-paper-raised border border-line rounded-lg shadow-elevated animate-rise" style={{ borderLeft: `4px solid ${couleur}` }}>
      <div className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft">Vous êtes classé·e dans :</div>
      <h3 className="text-2xl mt-1 mb-2.5" style={{ color: couleur }}>
        {classe.nom}
      </h3>
      <p>{classe.description}</p>

      <ReglePercentile percentile={r.percentile} />

      <dl className="grid gap-3.5 my-4 py-4 border-y border-dashed border-line" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <div>
          <dt className="font-mono text-[0.7rem] uppercase text-ink-soft">Niveau de vie estimé</dt>
          <dd className="font-display text-[1.1rem] mt-1">{euros(r.niveauDeVie)} / an / UC</dd>
        </div>
        <div>
          <dt className="font-mono text-[0.7rem] uppercase text-ink-soft">Position dans la population</dt>
          <dd className="font-display text-[1.1rem] mt-1">environ le {r.percentile}ᵉ percentile</dd>
        </div>
        <div>
          <dt className="font-mono text-[0.7rem] uppercase text-ink-soft">Unités de consommation</dt>
          <dd className="font-display text-[1.1rem] mt-1">{r.uc}</dd>
        </div>
      </dl>

      {r.estRetraiteOuInactif && (
        <p className="text-[0.9rem] bg-paper border-l-2 border-line-strong px-3.5 py-2.5 mt-4">
          Votre statut vous place dans la catégorie <strong>Retraités &amp; inactifs</strong>, car les mécanismes qui
          vous concernent le plus (pensions, dépenses de santé, minima sociaux) diffèrent de ceux d&apos;une personne
          en emploi. À titre indicatif, votre niveau de vie vous situerait, si vous étiez actif·ve, plutôt du côté
          des <strong>{classeRevenu.nom.toLowerCase()}</strong>.
        </p>
      )}
      {r.bumpPatrimoine && (
        <p className="text-[0.9rem] bg-paper border-l-2 border-line-strong px-3.5 py-2.5 mt-4">
          Votre revenu courant correspondait aux classes moyennes, mais votre patrimoine déclaré vous rapproche
          davantage des <strong>classes aisées</strong> pour les mesures fiscales portant sur le capital (IFI, droits
          de succession, etc.).
        </p>
      )}

      <RepereRetraiteBlock r={r} />

      <ReperesJeunesseBlock r={r} />

      <Link href={`/?classe=${r.classePrincipale}`} className="inline-block mt-4 font-mono text-[0.82rem] underline">
        Voir l&apos;impact des programmes sur cette catégorie →
      </Link>
    </div>
  );
}

export default function SimulateurForm() {
  const [resultat, setResultat] = useState<ResultatClassement | null>(null);
  const [anneeNaissance, setAnneeNaissance] = useState<string>("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const r = classerProfil({
      revenuNetAnnuelMenage: Number(data.get("revenuMensuel")) * 12,
      nbAdultes: Number(data.get("nbAdultes")),
      nbEnfants14Plus: Number(data.get("nbEnfants14Plus")),
      nbEnfantsMoins14: Number(data.get("nbEnfantsMoins14")),
      statutActivite: data.get("statutActivite") as StatutActivite,
      patrimoineNet: Number(data.get("patrimoineNet")) || 0,
      anneeNaissance: Number(data.get("anneeNaissance")) || null,
      trimestreNaissance: (data.get("trimestreNaissance") as TrimestreNaissance) || undefined,
    });
    setResultat(r);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 border border-line rounded-lg bg-paper-raised p-7 shadow-card">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="revenuMensuel" className="font-display text-[0.92rem]">
            Revenu net mensuel <strong>total du foyer</strong>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="revenuMensuel"
              name="revenuMensuel"
              type="number"
              min={0}
              step={10}
              required
              placeholder="Ex : 2400"
              className="flex-1 px-3 py-2.5 border border-line-strong bg-white rounded transition-shadow focus:shadow-[0_0_0_3px_rgba(16,19,26,0.08)] focus:outline-none focus:border-ink"
            />
            <span className="font-mono text-[0.85rem] text-ink-soft">€ / mois</span>
          </div>
          <p className="text-[0.8rem] text-ink-soft">
            Salaires, pensions, revenus indépendants, allocations chômage, prestations sociales cumulés.
          </p>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nbAdultes" className="font-display text-[0.92rem]">Adultes du foyer</label>
            <input id="nbAdultes" name="nbAdultes" type="number" min={1} max={6} defaultValue={1} required className="px-3 py-2.5 border border-line-strong bg-white rounded transition-shadow focus:shadow-[0_0_0_3px_rgba(16,19,26,0.08)] focus:outline-none focus:border-ink" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nbEnfants14Plus" className="font-display text-[0.92rem]">Enfants ≥ 14 ans</label>
            <input id="nbEnfants14Plus" name="nbEnfants14Plus" type="number" min={0} max={8} defaultValue={0} className="px-3 py-2.5 border border-line-strong bg-white rounded transition-shadow focus:shadow-[0_0_0_3px_rgba(16,19,26,0.08)] focus:outline-none focus:border-ink" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nbEnfantsMoins14" className="font-display text-[0.92rem]">Enfants &lt; 14 ans</label>
            <input id="nbEnfantsMoins14" name="nbEnfantsMoins14" type="number" min={0} max={8} defaultValue={0} className="px-3 py-2.5 border border-line-strong bg-white rounded transition-shadow focus:shadow-[0_0_0_3px_rgba(16,19,26,0.08)] focus:outline-none focus:border-ink" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="statutActivite" className="font-display text-[0.92rem]">Votre situation principale</label>
          <select id="statutActivite" name="statutActivite" required className="px-3 py-2.5 border border-line-strong bg-white rounded transition-shadow focus:shadow-[0_0_0_3px_rgba(16,19,26,0.08)] focus:outline-none focus:border-ink">
            <option value="emploi_salarie">Salarié·e en emploi</option>
            <option value="independant">Indépendant·e / profession libérale</option>
            <option value="retraite">Retraité·e</option>
            <option value="chomage">Sans emploi</option>
            <option value="etudiant">Étudiant·e</option>
            <option value="autre_inactif">Autre situation d&apos;inactivité</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="anneeNaissance" className="font-display text-[0.92rem]">Votre année de naissance</label>
          <input
            id="anneeNaissance"
            name="anneeNaissance"
            type="number"
            min={1940}
            max={2010}
            placeholder="Ex : 1978"
            value={anneeNaissance}
            onChange={(e) => setAnneeNaissance(e.target.value)}
            className="px-3 py-2.5 border border-line-strong bg-white rounded transition-shadow focus:shadow-[0_0_0_3px_rgba(16,19,26,0.08)] focus:outline-none focus:border-ink"
          />
          <p className="text-[0.8rem] text-ink-soft">
            Sert uniquement à indiquer votre âge légal de départ à la retraite applicable aujourd&apos;hui — un
            paramètre qui a changé plusieurs fois récemment selon votre génération.
          </p>
        </div>

        {anneeNaissance === "1965" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="trimestreNaissance" className="font-display text-[0.92rem]">
              Vous êtes né·e en 1965 — précisez :
            </label>
            <select id="trimestreNaissance" name="trimestreNaissance" className="px-3 py-2.5 border border-line-strong bg-white rounded transition-shadow focus:shadow-[0_0_0_3px_rgba(16,19,26,0.08)] focus:outline-none focus:border-ink">
              <option value="q1">Entre janvier et mars 1965</option>
              <option value="q2_4">Entre avril et décembre 1965</option>
            </select>
            <p className="text-[0.8rem] text-ink-soft">Pour cette seule génération, le mois de naissance change l&apos;âge légal applicable.</p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="patrimoineNet" className="font-display text-[0.92rem]">Patrimoine net estimé (optionnel)</label>
          <div className="flex items-center gap-2">
            <input id="patrimoineNet" name="patrimoineNet" type="number" min={0} step={1000} placeholder="Ex : 150000" className="flex-1 px-3 py-2.5 border border-line-strong bg-white rounded transition-shadow focus:shadow-[0_0_0_3px_rgba(16,19,26,0.08)] focus:outline-none focus:border-ink" />
            <span className="font-mono text-[0.85rem] text-ink-soft">€</span>
          </div>
          <p className="text-[0.8rem] text-ink-soft">Immobilier, épargne, placements, moins les dettes. Laissez vide si vous préférez ne pas répondre.</p>
        </div>

        <button type="submit" className="self-start font-mono uppercase tracking-wide text-[0.85rem] px-5.5 py-3 bg-ink text-paper-raised rounded shadow-xs transition-all hover:bg-ink-soft hover:shadow-card active:translate-y-px">
          Calculer mon classement
        </button>
      </form>

      {resultat && <Resultat r={resultat} />}
    </>
  );
}
