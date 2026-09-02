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
        Indiquez l&apos;importance que vous accordez à chaque thème pour obtenir un score personnalisé par candidat,
        en plus (et sans changer) de l&apos;affichage neutre par défaut.
      </p>

      <ul className="flex flex-col">
        {THEMES.map((theme, i) => (
          <li
            key={theme}
            className={`grid grid-cols-[minmax(150px,230px)_1fr] max-[480px]:grid-cols-1 items-center gap-4 max-[480px]:gap-2 py-3.5 ${
              i < THEMES.length - 1 ? "border-b border-dashed border-line" : "pb-1"
            }`}
          >
            <span className="text-[0.9rem] font-medium">{theme}</span>
            {/* Contrôle segmenté : les 4 niveaux forment un seul bloc à bordure partagée,
                plutôt que 4 boutons séparés — toujours le même gabarit quel que soit le
                nom du thème. Sur mobile, on repasse à des boutons individuels en grille 2x2. */}
            <div
              className="flex max-[480px]:grid max-[480px]:grid-cols-2 max-[480px]:gap-1.5 rounded border border-line-strong max-[480px]:border-0 overflow-hidden max-[480px]:overflow-visible bg-paper max-[480px]:bg-transparent"
              role="group"
              aria-label={`Priorité pour ${theme}`}
            >
              {NIVEAUX_PRIORITE.map((niveau, ni) => (
                <button
                  key={niveau}
                  type="button"
                  aria-pressed={poids[theme] === niveau}
                  onClick={() => setNiveau(theme, niveau)}
                  className={`flex-1 font-mono text-[0.66rem] uppercase tracking-wide px-1.5 py-2.5 text-center transition-colors max-[480px]:rounded max-[480px]:border max-[480px]:border-line-strong ${
                    ni < NIVEAUX_PRIORITE.length - 1 ? "border-r border-line-strong max-[480px]:border-r-line-strong" : ""
                  } ${
                    poids[theme] === niveau
                      ? "bg-accent-bleu text-paper-raised font-semibold max-[480px]:border-accent-bleu"
                      : "bg-transparent text-ink-soft hover:bg-accent-bleu-soft hover:text-paper-raised max-[480px]:bg-paper"
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
