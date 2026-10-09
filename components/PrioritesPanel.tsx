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
    <div className="rounded-2xl border border-line bg-paper p-8 mb-8 max-sm:p-5">
      <div className="flex justify-between items-baseline flex-wrap gap-3 mb-3">
        <h3 className="text-[1.4rem]">Mes priorités</h3>
        <button
          type="button"
          onClick={() => onChange(poidsThemesParDefaut())}
          className="font-display text-[0.88rem] text-ink-soft underline underline-offset-4 hover:text-accent-bleu"
        >
          Réinitialiser mes priorités
        </button>
      </div>

      <p className="text-[0.95rem] text-ink-soft mb-5 max-w-[60ch]">
        Indiquez l&apos;importance que vous accordez à chaque thème pour obtenir un score personnalisé par candidat,
        en plus (et sans changer) de l&apos;affichage neutre par défaut.
      </p>

      <ul className="flex flex-col">
        {THEMES.map((theme, i) => (
          <li
            key={theme}
            className={`flex flex-col gap-3 py-5 ${
              i < THEMES.length - 1 ? "border-b border-line" : "pb-1"
            }`}
          >
            <span className="font-display text-[0.95rem] font-medium">{theme}</span>
            {/* Contrôle segmenté : un seul bloc à 4 niveaux, de même gabarit quel que soit le nom du thème.
                Sur mobile, on repasse à des boutons individuels en grille 2x2. */}
            <div
              className="flex max-[480px]:grid max-[480px]:grid-cols-2 max-[480px]:gap-1.5 rounded-full border border-line-strong bg-paper-raised p-1 max-[480px]:rounded-xl max-[480px]:border-0 max-[480px]:bg-transparent max-[480px]:p-0"
              role="group"
              aria-label={`Priorité pour ${theme}`}
            >
              {NIVEAUX_PRIORITE.map((niveau) => (
                <button
                  key={niveau}
                  type="button"
                  aria-pressed={poids[theme] === niveau}
                  onClick={() => setNiveau(theme, niveau)}
                  className={`flex-1 whitespace-nowrap rounded-full px-2 py-2.5 text-center font-display text-[0.85rem] font-medium transition-colors max-[480px]:rounded-lg max-[480px]:border max-[480px]:border-line-strong ${
                    poids[theme] === niveau
                      ? "bg-accent-bleu text-white shadow-sm max-[480px]:border-accent-bleu"
                      : "text-ink-soft hover:bg-paper-deep hover:text-accent-bleu max-[480px]:bg-paper-raised"
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
