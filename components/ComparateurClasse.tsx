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
        <div className="flex justify-between items-end flex-wrap gap-5 mb-8">
          <h2 className="font-body font-semibold text-[clamp(1.7rem,3vw,2.2rem)] leading-tight tracking-[-0.015em]">
            Impact sur <span className="text-accent-bleu">{classeInfo.nom.toLowerCase()}</span>
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2.5 font-display text-[0.9rem] text-ink-soft">
              Thème
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
                className="font-display text-[0.92rem] text-ink pl-4 pr-3 py-2.5 border border-line-strong bg-paper-raised rounded-full focus-visible:border-accent-bleu hover:border-accent-bleu-soft transition-colors"
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
              className={`font-display text-[0.92rem] px-5 py-2.5 border rounded-full transition-colors ${
                modePriorites
                  ? "bg-accent-bleu text-white border-accent-bleu"
                  : "bg-paper-raised text-ink border-line-strong hover:border-accent-bleu-soft hover:text-accent-bleu"
              }`}
            >
              Mes priorités
            </button>
          </div>
        </div>

        {modePriorites && (
          <>
            <PrioritesPanel poids={poids} onChange={setPoids} />
            <label className="flex items-center gap-2 font-display text-[0.9rem] text-ink-soft mb-4">
              <input type="checkbox" checked={trierParScore} onChange={(e) => setTrierParScore(e.target.checked)} />
              Trier par mon score personnalisé (expérimental — ce n&apos;est ni un classement ni une recommandation)
            </label>
          </>
        )}

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }} aria-live="polite">
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
