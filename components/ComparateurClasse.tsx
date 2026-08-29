"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CANDIDATS, CLASSES_SOCIALES, THEMES, type ClasseId, type Theme } from "@/lib/data";
import ClasseRail from "./ClasseRail";
import CarteCandidat from "./CarteCandidat";

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

  const classeInfo = CLASSES_SOCIALES.find((c) => c.id === classeActive)!;

  return (
    <div className="grid grid-cols-[220px_1fr] gap-8 max-md:grid-cols-1">
      <ClasseRail classeActive={classeActive} onChange={setClasseActive} />

      <main>
        <div className="flex justify-between items-baseline flex-wrap gap-3 mb-5">
          <h2 className="text-2xl">
            Impact sur : <span className="font-mono text-[1.1rem]">{classeInfo.nom}</span>
          </h2>
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
        </div>

        <div className="grid gap-4.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }} aria-live="polite">
          {CANDIDATS.map((candidat) => (
            <CarteCandidat key={candidat.id} candidat={candidat} theme={theme} classeActive={classeActive} />
          ))}
        </div>
      </main>
    </div>
  );
}
