"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CANDIDATS_ALPHABETIQUE, CLASSES_SOCIALES, THEMES, type ClasseId, type Theme } from "@/lib/data";
import ClasseRail from "./ClasseRail";
import CarteCandidat from "./CarteCandidat";

function classeValide(id: string | null): id is ClasseId {
  return !!id && CLASSES_SOCIALES.some((c) => c.id === id);
}

/**
 * Exploration libre des programmes : pour une catégorie sociale et un thème, les mesures recensées de chaque
 * candidat. Ordre alphabétique, jamais de tri par score. Les candidats sans mesure sur le thème choisi restent
 * tous listés (équité), regroupés dans un volet replié pour ne pas noyer les mesures sous des cartes vides.
 */
export default function ComparateurClasse() {
  const params = useSearchParams();
  const initiale = params.get("classe");

  const [classeActive, setClasseActive] = useState<ClasseId>(
    classeValide(initiale) ? initiale : CLASSES_SOCIALES[0].id
  );
  const [theme, setTheme] = useState<Theme>(THEMES[0]);

  const classeInfo = CLASSES_SOCIALES.find((c) => c.id === classeActive)!;
  const aUneMesure = (id: string) =>
    CANDIDATS_ALPHABETIQUE.find((c) => c.id === id)!.mesures.some((m) => m.theme === theme);
  const avecMesure = CANDIDATS_ALPHABETIQUE.filter((c) => aUneMesure(c.id));
  const sansMesure = CANDIDATS_ALPHABETIQUE.filter((c) => !aUneMesure(c.id));

  return (
    <div className="grid grid-cols-[220px_1fr] gap-8 max-md:grid-cols-1">
      <ClasseRail classeActive={classeActive} onChange={setClasseActive} />

      <div>
        <div className="flex justify-between items-end flex-wrap gap-5 mb-8">
          <h2 className="font-body font-semibold text-[clamp(1.7rem,3vw,2.2rem)] leading-tight tracking-[-0.015em]">
            Impact sur <span className="text-accent-bleu">{classeInfo.nom.toLowerCase()}</span>
          </h2>
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
        </div>

        <div aria-live="polite">
          {avecMesure.length === 0 ? (
            <p className="mb-6 text-ink-soft">Aucune mesure n&apos;est encore recensée sur ce thème.</p>
          ) : (
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))" }}>
              {avecMesure.map((candidat) => (
                <CarteCandidat key={candidat.id} candidat={candidat} theme={theme} classeActive={classeActive} />
              ))}
            </div>
          )}

          {sansMesure.length > 0 && (
            <details className="mt-8 rounded-xl bg-paper-deep/60 px-5 py-4">
              <summary className="cursor-pointer font-display text-[0.95rem] font-medium text-ink">
                {sansMesure.length} autre{sansMesure.length > 1 ? "s" : ""} candidat{sansMesure.length > 1 ? "s" : ""} : aucune
                mesure recensée sur ce thème
              </summary>
              <p className="font-body text-[0.9rem] text-ink-soft italic mt-3 mb-3">
                Ce n&apos;est ni un bon ni un mauvais point : aucune mesure solidement sourcée n&apos;a (encore) été recensée
                pour eux sur ce thème. Liste par ordre alphabétique.
              </p>
              <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {sansMesure.map((c) => (
                  <li key={c.id} className="font-display text-[0.92rem]">
                    <Link
                      href={`/candidats/${c.id}`}
                      className="inline-flex min-h-[36px] items-center underline decoration-line-strong underline-offset-4 hover:text-accent-bleu"
                    >
                      {c.nom}
                    </Link>{" "}
                    <span className="text-[0.82rem] text-ink-faint">· {c.parti}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
