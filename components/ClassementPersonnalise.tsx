import type { Candidat } from "@/lib/data";
import type { ScorePersonnalise as ScorePersonnaliseResultat } from "@/lib/priorites";
import ScorePersonnalise from "./ScorePersonnalise";

interface Props {
  classement: Candidat[];
  resultats: Map<string, ScorePersonnaliseResultat>;
  /** Met en avant le premier de la liste (résultat personnel) ; désactivé sur un résultat partagé. */
  attenuerSuivants?: boolean;
}

/**
 * Classement complet : les candidats dont le score est calculable, dans l'ordre, puis — dans un volet
 * repliable mais toujours accessible — les candidats pour lesquels aucune mesure n'est recensée sur les
 * thèmes prioritaires (ordre alphabétique). Aucun candidat n'est jamais retiré de la liste.
 */
export default function ClassementPersonnalise({ classement, resultats, attenuerSuivants = true }: Props) {
  const calculables = classement.filter((c) => resultats.get(c.id)?.scoreGlobal !== null);
  const nonCalculables = classement.filter((c) => resultats.get(c.id)?.scoreGlobal === null);

  return (
    <>
      {calculables.length > 0 && (
        <ol className="flex flex-col gap-4">
          {calculables.map((candidat, i) => (
            <li key={candidat.id} className={attenuerSuivants && i !== 0 ? "opacity-80" : ""}>
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <span className="font-display">
                  {i + 1}. {candidat.nom}{" "}
                  <span className="font-display text-[0.84rem] font-medium text-ink-faint">{candidat.parti}</span>
                </span>
              </div>
              <ScorePersonnalise resultat={resultats.get(candidat.id)!} />
            </li>
          ))}
        </ol>
      )}

      {nonCalculables.length > 0 && (
        <details className="mt-6 rounded-xl bg-paper-deep/60 px-5 py-4" open={calculables.length === 0}>
          <summary className="cursor-pointer font-display text-[0.95rem] font-medium text-ink">
            {nonCalculables.length} autre{nonCalculables.length > 1 ? "s" : ""} candidat
            {nonCalculables.length > 1 ? "s" : ""} : score non calculable
          </summary>
          <p className="font-body text-[0.9rem] text-ink-soft mt-3 mb-3 italic">
            Aucune mesure n&apos;est recensée pour ces candidats sur vos thèmes prioritaires : aucun score ne peut être
            calculé, et ce n&apos;est ni un bon ni un mauvais résultat.
          </p>
          <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {nonCalculables.map((candidat) => (
              <li key={candidat.id} className="font-display text-[0.92rem]">
                {candidat.nom} <span className="text-[0.82rem] text-ink-faint">· {candidat.parti}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
