"use client";

import { THEMES, type Theme } from "@/lib/data";
import { LABELS_PRIORITE, NIVEAUX_PRIORITE, poidsThemesParDefaut, type NiveauPriorite, type PoidsThemes } from "@/lib/priorites";

interface Props {
  poids: PoidsThemes;
  onChange: (poids: PoidsThemes) => void;
}

export default function PrioritesPanel({ poids, onChange }: Props) {
  function setNiveau(theme: Theme, niveau: NiveauPriorite) {
    onChange({ ...poids, [theme]: niveau });
  }

  return (
    <div className="border border-line rounded-lg bg-paper-raised p-5.5 mb-6">
      <div className="flex justify-between items-baseline flex-wrap gap-3 mb-4">
        <h3 className="font-display text-[1.1rem]">Mes priorités</h3>
        <button
          type="button"
          onClick={() => onChange(poidsThemesParDefaut())}
          className="font-mono text-[0.72rem] uppercase tracking-wide underline text-ink-soft hover:text-accent-rouge"
        >
          Réinitialiser mes priorités
        </button>
      </div>

      <p className="text-[0.85rem] text-ink-soft mb-4">
        Indiquez l&apos;importance que vous accordez à chaque thème : les cartes ci-dessous affichent alors un score
        personnalisé, en plus (et sans changer) de l&apos;affichage neutre par défaut.
      </p>

      <ul className="flex flex-col gap-3">
        {THEMES.map((theme) => (
          <li key={theme} className="flex justify-between items-center flex-wrap gap-2.5 max-[480px]:flex-col max-[480px]:items-start">
            <span className="text-[0.9rem]">{theme}</span>
            <div
              className="flex flex-wrap gap-1.5 max-[480px]:grid max-[480px]:grid-cols-2 max-[480px]:w-full"
              role="group"
              aria-label={`Priorité pour ${theme}`}
            >
              {NIVEAUX_PRIORITE.map((niveau) => (
                <button
                  key={niveau}
                  type="button"
                  aria-pressed={poids[theme] === niveau}
                  onClick={() => setNiveau(theme, niveau)}
                  className={`font-mono text-[0.68rem] uppercase tracking-wide px-2.5 py-1.5 border rounded transition-colors text-center ${
                    poids[theme] === niveau
                      ? "bg-accent-bleu text-paper-raised border-accent-bleu"
                      : "bg-paper text-ink-soft border-line-strong hover:border-accent-bleu"
                  }`}
                  title={LABELS_PRIORITE[niveau]}
                >
                  {LABELS_PRIORITE[niveau]}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
