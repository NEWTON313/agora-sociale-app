"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QUESTIONS, SEUIL_COUVERTURE, classerBoussole, type Importance, type Reponses } from "@/lib/boussole";
import type { Choix } from "@/lib/positions";

const pct = (n: number) => `${n > 0 ? "+" : ""}${Math.round(n * 100)} %`;
const IMPORTANCES: { v: Importance; label: string }[] = [
  { v: 1, label: "Peu" },
  { v: 2, label: "Important" },
  { v: 3, label: "Essentiel" },
];

/**
 * Test « boussole » : choix entre deux propositions, importance, puis proximité avec les positions DOCUMENTÉES
 * de chaque candidat. L'ordre des options A/B est tiré au hasard à chaque visite. Rien n'est envoyé ni conservé.
 */
export default function BoussoleForm() {
  const [inverse, setInverse] = useState<Record<number, boolean> | null>(null);
  const [reponses, setReponses] = useState<Reponses>({});
  const [resultat, setResultat] = useState(false);

  // Tirage au hasard après l'hydratation (évite un écart entre rendu serveur et client).
  useEffect(() => {
    setInverse(Object.fromEntries(QUESTIONS.map((q) => [q.id, Math.random() < 0.5])));
  }, []);

  const nbRepondues = QUESTIONS.filter((q) => reponses[q.id]?.choix).length;
  const classement = useMemo(() => (resultat ? classerBoussole(reponses) : null), [resultat, reponses]);

  if (!inverse) return <p className="text-ink-soft">Chargement du test…</p>;

  function choisir(id: number, choix: Choix | null) {
    setReponses((r) => ({ ...r, [id]: { choix, poids: r[id]?.poids ?? 2 } }));
  }
  function pondérer(id: number, poids: Importance) {
    setReponses((r) => ({ ...r, [id]: { choix: r[id]?.choix ?? null, poids } }));
  }

  if (resultat && classement) {
    return (
      <div>
        <div className="rounded-xl bg-paper-deep/70 px-5 py-4 text-[0.92rem] leading-relaxed text-ink-soft mb-8">
          Ce classement mesure la <strong className="text-ink">proximité entre vos choix et les positions documentées</strong>{" "}
          des candidats (chacune renvoie à une source). Une position non documentée est écartée : ce n&apos;est jamais un
          désaccord. Un candidat n&apos;est classé qu&apos;à partir de {SEUIL_COUVERTURE} questions couvertes. Ce n&apos;est pas
          une recommandation de vote.
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
                  <span className="font-display text-[1.15rem] font-medium">{pct(p.score!)}</span>
                </div>
                <p className="font-display text-[0.88rem] text-ink-soft mt-1">
                  D&apos;accord sur {p.accords} question{p.accords > 1 ? "s" : ""} sur {p.documentees} où sa position est
                  documentée ({p.documentees} sur {p.repondues} auxquelles vous avez répondu).
                </p>
                <details className="mt-3">
                  <summary className="cursor-pointer font-display text-[0.86rem] text-accent-bleu">Voir le détail et les sources</summary>
                  <ul className="mt-2 flex flex-col gap-2 text-[0.88rem] text-ink-soft">
                    {p.details.map((d) => (
                      <li key={d.question}>
                        <strong className="font-medium text-ink">{d.accord ? "D'accord" : "Pas d'accord"}</strong> — question{" "}
                        {d.question} : {d.titreMesure}.{" "}
                        <a href={d.source} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                          Source
                        </a>
                      </li>
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
                </span>
              </li>
            ))}
          </ul>
        </details>

        <div className="mt-8 flex flex-wrap gap-4 font-display text-[0.95rem]">
          <button type="button" onClick={() => setResultat(false)} className="underline underline-offset-4">
            ← Modifier mes réponses
          </button>
          <Link href="/transparence" className="underline underline-offset-4">
            Comment ces positions sont établies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
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
                      r?.choix === o.cle ? "border-accent-bleu bg-paper-deep font-medium text-ink" : "border-line text-ink-soft hover:border-line-strong"
                    }`}
                  >
                    {o.texte}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 font-display text-[0.86rem]">
                <button
                  type="button"
                  onClick={() => choisir(q.id, null)}
                  className={`underline underline-offset-4 ${r?.choix ? "text-ink-faint" : "text-ink"}`}
                >
                  Sans avis / ni l&apos;un ni l&apos;autre
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
          onClick={() => {
            setResultat(true);
            window.scrollTo({ top: 0 });
          }}
          className="rounded-xl bg-accent-bleu px-5 py-2.5 font-display text-[0.95rem] font-medium text-white disabled:opacity-40"
        >
          Voir ma proximité avec les candidats
        </button>
      </div>
    </div>
  );
}
