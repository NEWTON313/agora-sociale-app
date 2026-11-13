"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  QUESTIONS,
  SEUIL_COUVERTURE,
  classerBoussole,
  poidsThemesDepuisBoussole,
  type DetailQuestion,
  type Importance,
  type Reponses,
} from "@/lib/boussole";
import type { Candidat, ClasseId } from "@/lib/data";
import { formatIndice, formatScore } from "@/lib/format";
import { nomMedia } from "@/lib/sources";
import { calculerScorePersonnalise, type PoidsThemes } from "@/lib/priorites";
import type { Choix } from "@/lib/positions";
import PartagerResultat from "./PartagerResultat";


/** Effet économique estimé sur la catégorie de la personne : information complémentaire, jamais utilisée pour classer. */
function EffetEconomique({ candidat, classe, poids }: { candidat: Candidat; classe: ClasseId; poids: PoidsThemes }) {
  const r = calculerScorePersonnalise(candidat, classe, poids);
  return (
    <span>
      {r.scoreGlobal === null
        ? "non calculable (aucune mesure recensée sur vos thèmes prioritaires)"
        : `${formatScore(r.scoreGlobal)} (${r.themesCouverts} thème${r.themesCouverts > 1 ? "s" : ""} couvert${r.themesCouverts > 1 ? "s" : ""} sur ${r.themesPonderes})`}
    </span>
  );
}

const LIBELLE_VALIDATION: Record<DetailQuestion["validation"], string> = {
  officielle: "Programme ou site officiel",
  recoupee: "Recoupée par plusieurs médias",
  unique: "Source unique, à recouper",
};

/** Date de source (AAAA-MM-JJ ou AAAA-MM) au format français court. */
function dateCourte(date: string): string {
  const [a, m, j] = date.split("-");
  return j ? `${j}/${m}/${a}` : `${m}/${a}`;
}

/**
 * Une ligne du détail d'un résultat : la question, le choix de la personne, la position du candidat, puis ce qui
 * l'établit (mesure, citation, sources datées) et son niveau de validation.
 */
function DetailPosition({ detail, choixUtilisateur }: { detail: DetailQuestion; choixUtilisateur: Choix }) {
  const q = QUESTIONS.find((x) => x.id === detail.question)!;
  const texte = (c: Choix) => (c === "A" ? q.a : q.b);
  return (
    <li className="border-t border-line pt-3">
      <div className="font-display text-[0.86rem]">
        <strong className={`font-medium ${detail.accord ? "text-positif" : "text-negatif"}`}>
          {detail.accord ? "D'accord" : "Pas d'accord"}
        </strong>{" "}
        <span className="text-ink-faint">
          · question {detail.question} · {q.theme}
        </span>
      </div>
      <p className="mt-1">
        <span className="text-ink-faint">Votre choix :</span> {texte(choixUtilisateur)}
      </p>
      {!detail.accord && (
        <p className="mt-1">
          <span className="text-ink-faint">Sa position :</span> {texte(detail.choixCandidat)}
        </p>
      )}
      <p className="mt-1">
        <span className="text-ink-faint">Établie par :</span> {detail.titreMesure}.
        {detail.citation && <> «&nbsp;{detail.citation}&nbsp;»</>}
      </p>
      <p className="mt-1 font-display text-[0.8rem] text-ink-faint">
        {LIBELLE_VALIDATION[detail.validation]} —{" "}
        {detail.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && ", "}
            <a href={s.url} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              {nomMedia(s.url)}
            </a>
            {s.date && ` (${dateCourte(s.date)})`}
          </span>
        ))}
      </p>
    </li>
  );
}

const IMPORTANCES: { v: Importance; label: string }[] = [
  { v: 1, label: "Peu" },
  { v: 2, label: "Important" },
  { v: 3, label: "Essentiel" },
];

/**
 * Test « boussole » : choix entre deux propositions, importance, puis proximité avec les positions DOCUMENTÉES
 * de chaque candidat. L'ordre des options A/B est tiré au hasard à chaque visite. Rien n'est envoyé ni conservé.
 */
export default function BoussoleForm({ classe, onModifierSituation }: { classe: ClasseId | null; onModifierSituation: () => void }) {
  const [inverse, setInverse] = useState<Record<number, boolean> | null>(null);
  const [reponses, setReponses] = useState<Reponses>({});
  const [resultat, setResultat] = useState(false);

  // En passant du questionnaire au résultat (et inversement), on revient au début du bloc, pas en haut de la page.
  const racine = useRef<HTMLDivElement>(null);
  const resultatPrecedent = useRef(resultat);
  useEffect(() => {
    if (resultatPrecedent.current === resultat) return;
    resultatPrecedent.current = resultat;
    racine.current?.scrollIntoView({ block: "start" });
  }, [resultat]);

  // Tirage au hasard après l'hydratation (évite un écart entre rendu serveur et client).
  useEffect(() => {
    setInverse(Object.fromEntries(QUESTIONS.map((q) => [q.id, Math.random() < 0.5])));
  }, []);

  const nbRepondues = QUESTIONS.filter((q) => reponses[q.id]?.choix || reponses[q.id]?.sansAvis).length;
  const classement = useMemo(() => (resultat ? classerBoussole(reponses) : null), [resultat, reponses]);
  const poidsEco = useMemo(() => poidsThemesDepuisBoussole(reponses), [reponses]);

  if (!inverse) return <p className="text-ink-soft">Chargement du test…</p>;

  function choisir(id: number, choix: Choix | null) {
    setReponses((r) => ({ ...r, [id]: { choix, poids: r[id]?.poids ?? 2, sansAvis: false } }));
  }
  function sansAvis(id: number) {
    setReponses((r) => ({ ...r, [id]: { choix: null, poids: r[id]?.poids ?? 2, sansAvis: !r[id]?.sansAvis } }));
  }
  function pondérer(id: number, poids: Importance) {
    setReponses((r) => ({ ...r, [id]: { choix: r[id]?.choix ?? null, poids, sansAvis: r[id]?.sansAvis } }));
  }

  if (resultat && classement) {
    return (
      <div ref={racine} className="scroll-mt-48">
        <div className="rounded-xl bg-paper-deep/70 px-5 py-4 text-[0.92rem] leading-relaxed text-ink-soft mb-8">
          Ce classement mesure la <strong className="text-ink">proximité entre vos choix et les positions documentées</strong>{" "}
          des candidats (chacune renvoie à une source). Une position non documentée est écartée : ce n&apos;est jamais un
          désaccord. Un candidat n&apos;est classé qu&apos;à partir de {SEUIL_COUVERTURE} questions couvertes. L&apos;
          <strong className="text-ink">indice de proximité</strong> va de −100 à +100 et tient compte du nombre de
          questions documentées : un accord sur peu de questions pèse moins qu&apos;un accord sur beaucoup. Ce n&apos;est pas
          une recommandation de vote.
          {classe && (
            <>
              {" "}
              À côté de chaque candidat, l&apos;<strong className="text-ink">effet économique estimé sur votre catégorie</strong>{" "}
              est une information distincte (calculée avec les thèmes de vos réponses) : elle ne sert pas au classement par proximité.
            </>
          )}
        </div>

        <h2 className="text-[1.5rem] mb-4">Proximité avec vos choix</h2>
        {classement.classes.length === 0 ? (
          <p className="text-ink-soft mb-8">
            Aucun candidat n&apos;a assez de positions documentées sur les questions auxquelles vous avez répondu pour être
            classé. Répondez à davantage de questions, ou consultez la liste ci-dessous.
          </p>
        ) : (
          <ol className="flex flex-col gap-4 mb-10">
            {classement.classes.map((p, i) => (
              <li key={p.candidat.id} className="rounded-2xl border border-line bg-paper-raised p-5 shadow-card">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-[1.05rem]">
                    {i + 1}. {p.candidat.nom}{" "}
                    <span className="text-[0.84rem] font-medium text-ink-faint">{p.candidat.parti}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap font-display text-[1.15rem] font-medium">
                    <span className="sr-only">Indice de proximité : </span>
                    {formatIndice(p.indice!)}
                    <span className="text-[0.8rem] font-normal text-ink-faint"> / 100</span>
                  </span>
                </div>
                <p className="font-display text-[0.88rem] text-ink-soft mt-1">
                  D&apos;accord sur {p.accords} question{p.accords > 1 ? "s" : ""} sur {p.documentees} où sa position est
                  documentée.
                </p>
                <div className="mt-2.5">
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-paper-deep"
                    role="img"
                    aria-label={`Position documentée sur ${p.documentees} des ${p.repondues} questions auxquelles vous avez répondu`}
                  >
                    <div className="h-full rounded-full bg-accent-bleu-soft" style={{ width: `${(p.documentees / p.repondues) * 100}%` }} />
                  </div>
                  <p className="mt-1 font-display text-[0.8rem] text-ink-faint">
                    Couverture : sa position est documentée sur {p.documentees} de vos {p.repondues} réponses.
                  </p>
                </div>
                {classe && (
                  <p className="font-display text-[0.88rem] text-ink-soft mt-1">
                    Effet économique estimé sur votre catégorie :{" "}
                    <EffetEconomique candidat={p.candidat} classe={classe} poids={poidsEco} />
                  </p>
                )}
                <details className="mt-3">
                  <summary className="cursor-pointer font-display text-[0.86rem] text-accent-bleu">Voir le détail et les sources</summary>
                  <ul className="mt-3 flex flex-col gap-3 text-[0.88rem] text-ink-soft">
                    {p.details.map((d) => (
                      <DetailPosition key={d.question} detail={d} choixUtilisateur={reponses[d.question].choix!} />
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ol>
        )}

        <details className="rounded-xl bg-paper-deep/60 px-5 py-4" open={classement.classes.length === 0}>
          <summary className="cursor-pointer font-display text-[0.95rem] font-medium text-ink">
            {classement.autres.length} autres candidats : pas assez de positions documentées
          </summary>
          <p className="font-body text-[0.9rem] text-ink-soft italic mt-3 mb-3">
            Ce n&apos;est ni un bon ni un mauvais résultat : leurs positions sur ces questions ne sont pas (encore)
            documentées. Liste par ordre alphabétique.
          </p>
          <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {classement.autres.map((p) => (
              <li key={p.candidat.id} className="font-display text-[0.92rem]">
                {p.candidat.nom}{" "}
                <span className="text-[0.82rem] text-ink-faint">
                  · {p.documentees} position{p.documentees > 1 ? "s" : ""} documentée{p.documentees > 1 ? "s" : ""}
                  {classe && (
                    <>
                      {" "}
                      · effet économique : <EffetEconomique candidat={p.candidat} classe={classe} poids={poidsEco} />
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </details>

        <div className="mt-8 flex flex-wrap gap-4 font-display text-[0.95rem]">
          <button type="button" onClick={() => setResultat(false)} className="underline underline-offset-4">
            ← Modifier mes réponses
          </button>
          <button type="button" onClick={onModifierSituation} className="underline underline-offset-4">
            ← Modifier ma situation (étape 1)
          </button>
          <Link href="/transparence" className="underline underline-offset-4">
            Comment ces positions sont établies
          </Link>
        </div>
        {classe && <PartagerResultat classe={classe} poids={poidsEco} />}
      </div>
    );
  }

  return (
    <div ref={racine} className="scroll-mt-48">
      <ol className="flex flex-col gap-6">
        {QUESTIONS.map((q) => {
          const r = reponses[q.id];
          const options: { cle: Choix; texte: string }[] = [
            { cle: "A", texte: q.a },
            { cle: "B", texte: q.b },
          ];
          if (inverse[q.id]) options.reverse();
          return (
            <li key={q.id} className="rounded-2xl border border-line bg-paper-raised p-6 shadow-card">
              <div className="font-display text-[0.8rem] font-medium text-ink-faint mb-3">
                {q.id}/{QUESTIONS.length} · {q.theme}
              </div>
              <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={`Question ${q.id}`}>
                {options.map((o) => (
                  <button
                    key={o.cle}
                    type="button"
                    role="radio"
                    aria-checked={r?.choix === o.cle}
                    onClick={() => choisir(q.id, r?.choix === o.cle ? null : o.cle)}
                    className={`rounded-xl border px-4 py-3 text-left text-[1rem] leading-snug transition-colors ${
                      r?.choix === o.cle ? "border-accent-bleu bg-paper-deep font-medium text-ink" : r?.sansAvis ? "border-line text-ink-faint hover:border-line-strong" : "border-line text-ink-soft hover:border-line-strong"
                    }`}
                  >
                    {o.texte}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 font-display text-[0.86rem]">
                <button
                  type="button"
                  aria-pressed={!!r?.sansAvis}
                  onClick={() => sansAvis(q.id)}
                  className={`rounded-full border px-3.5 py-1.5 transition-colors ${
                    r?.sansAvis ? "border-accent-bleu bg-paper-deep font-medium text-ink" : "border-line text-ink-soft hover:border-line-strong"
                  }`}
                >
                  {r?.sansAvis ? "✓ " : ""}Sans avis / ni l&apos;un ni l&apos;autre
                </button>
                {r?.choix && (
                  <span className="flex items-center gap-1.5 text-ink-soft">
                    Importance :
                    {IMPORTANCES.map((i) => (
                      <button
                        key={i.v}
                        type="button"
                        aria-pressed={r.poids === i.v}
                        onClick={() => pondérer(q.id, i.v)}
                        className={`rounded-full px-3 py-1 ${r.poids === i.v ? "bg-accent-bleu text-white" : "bg-paper-deep text-ink-soft"}`}
                      >
                        {i.label}
                      </button>
                    ))}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="sticky bottom-4 mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper-raised p-4 shadow-elevated">
        <span className="font-display text-[0.92rem] text-ink-soft">
          {nbRepondues} réponse{nbRepondues > 1 ? "s" : ""} sur {QUESTIONS.length}
        </span>
        <button
          type="button"
          disabled={nbRepondues === 0}
          onClick={() => setResultat(true)}
          className="rounded-xl bg-accent-bleu px-5 py-2.5 font-display text-[0.95rem] font-medium text-white disabled:opacity-40"
        >
          Voir ma proximité avec les candidats
        </button>
      </div>
    </div>
  );
}
