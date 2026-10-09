import type { Candidat } from "@/lib/data";
import type { ScorePersonnalise as ScorePersonnaliseResultat } from "@/lib/priorites";
import ScorePersonnalise from "./ScorePersonnalise";

interface Props {
  classement: Candidat[];
  resultats: Map<string, ScorePersonnaliseResultat>;
  /** Met en avant le premier de la liste (résultat personnel) ; désactivé sur un résultat partagé. */
  attenuerSuivants?: boolean;
}

export default function ClassementPersonnalise({ classement, resultats, attenuerSuivants = true }: Props) {
  const premierCalculable = resultats.get(classement[0].id)?.scoreGlobal !== null;
  return (
    <ol className="flex flex-col gap-4">
      {classement.map((candidat, i) => (
        <li key={candidat.id} className={attenuerSuivants && !(i === 0 && premierCalculable) ? "opacity-80" : ""}>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span className="font-display">
              {i + 1}. {candidat.nom}{" "}
              <span className="font-mono text-[0.7rem] uppercase text-ink-faint">{candidat.parti}</span>
            </span>
          </div>
          <ScorePersonnalise resultat={resultats.get(candidat.id)!} />
        </li>
      ))}
    </ol>
  );
}
