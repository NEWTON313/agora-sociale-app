"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CANDIDATS, CLASSES_SOCIALES, THEMES, type ClasseId, type Theme } from "@/lib/data";
import { calculerScorePersonnalise, poidsThemesParDefaut, trierParScorePersonnalise, type PoidsThemes } from "@/lib/priorites";
import ClasseRail from "./ClasseRail";
import CarteCandidat from "./CarteCandidat";
import PrioritesPanel from "./PrioritesPanel";

function classeValide(id: string | null): id is ClasseId {
  return !!id && CLASSES_SOCIALES.some((c) => c.id === id);
}

export default function ComparateurClasse() {
  const params = useSearchParams();
  const initiale = params.get("classe");

  const [classeActive, setClasseActive] = useState<ClasseId>(
    classeValide(initiale) ? initiale : CLASSES_SOCIALES[0].id
  );
  const [theme, setTheme] = useState<Theme>(THEMES[0]);

  // Mode "priorités" : vue optionnelle en plus de l'affichage neutre par défaut (mode "theme"),
  // jamais un remplacement — voir garde-fous de neutralité dans la méthodologie.
  const [modePriorites, setModePriorites] = useState(false);
  const [poids, setPoids] = useState<PoidsThemes>(poidsThemesParDefaut());
  const [trierParScore, setTrierParScore] = useState(false);

  const classeInfo = CLASSES_SOCIALES.find((c) => c.id === classeActive)!;

  const resultatsPersonnalises = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculerScorePersonnalise>>();
    if (!modePriorites) return map;
    for (const candidat of CANDIDATS) {
      map.set(candidat.id, calculerScorePersonnalise(candidat, classeActive, poids));
    }
    return map;
  }, [modePriorites, classeActive, poids]);

  const candidatsAffiches =
    modePriorites && trierParScore ? trierParScorePersonnalise(CANDIDATS, resultatsPersonnalises) : CANDIDATS;

  return (
    <div className="grid grid-cols-[220px_1fr] gap-8 max-md:grid-cols-1">
      <ClasseRail classeActive={classeActive} onChange={setClasseActive} />

      <main>
        <div className="flex justify-between items-baseline flex-wrap gap-3 mb-5">
          <h2 className="text-2xl">
            Impact sur : <span className="font-mono text-[1.1rem]">{classeInfo.nom}</span>
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-mono text-[0.8rem]">
              Thème :{" "}
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
                className="font-mono text-[0.85rem] px-2.5 py-2 border border-line-strong bg-paper-raised rounded"
              >
                {THEMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setModePriorites((v) => !v)}
              aria-pressed={modePriorites}
              className={`font-mono text-[0.78rem] uppercase tracking-wide px-3 py-2 border rounded transition-colors ${
                modePriorites
                  ? "bg-ink text-paper-raised border-ink"
                  : "bg-paper-raised text-ink-soft border-line-strong hover:border-ink"
              }`}
            >
              Mes priorités
            </button>
          </div>
        </div>

        {modePriorites && (
          <>
            <PrioritesPanel poids={poids} onChange={setPoids} />
            <label className="flex items-center gap-2 font-mono text-[0.78rem] text-ink-soft mb-4">
              <input type="checkbox" checked={trierParScore} onChange={(e) => setTrierParScore(e.target.checked)} />
              Trier par mon score personnalisé (expérimental — ce n&apos;est ni un classement ni une recommandation)
            </label>
          </>
        )}

        <div className="grid gap-4.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }} aria-live="polite">
          {candidatsAffiches.map((candidat) => (
            <CarteCandidat
              key={candidat.id}
              candidat={candidat}
              theme={theme}
              classeActive={classeActive}
              scorePersonnalise={modePriorites ? resultatsPersonnalises.get(candidat.id) : undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
