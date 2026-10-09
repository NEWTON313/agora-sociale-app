"use client";

import { CLASSES_SOCIALES, type ClasseId } from "@/lib/data";

interface Props {
  classeActive: ClasseId;
  onChange: (id: ClasseId) => void;
}

// ⚠️ Tailwind ne peut pas détecter des classes construites dynamiquement
// (ex. `bg-${variable}`) car son moteur JIT scanne le code source de façon
// statique. On passe donc les couleurs par style inline, en réutilisant les
// mêmes valeurs que tailwind.config.js (à terme, lib/data.ts pourrait exposer
// directement les valeurs hex pour éviter cette duplication).
const COULEURS: Record<ClasseId, { fg: string; bg: string }> = {
  populaires: { fg: "#3d5a78", bg: "#e2e8ee" },
  moyennes: { fg: "#566f4d", bg: "#e6ebe3" },
  aisees: { fg: "#7a4258", bg: "#eee2e6" },
  retraites: { fg: "#9c7539", bg: "#f1e8d7" },
};

export default function ClasseRail({ classeActive, onChange }: Props) {
  return (
    <aside
      className="sticky top-[96px] self-start overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-card max-md:static max-md:flex max-md:overflow-x-auto"
      aria-label="Filtrer par catégorie sociale"
    >
      <div className="font-display text-[0.88rem] font-medium px-5 py-4 border-b border-line text-ink-faint max-md:hidden">
        Catégorie sociale
      </div>
      {CLASSES_SOCIALES.map((c) => {
        const active = c.id === classeActive;
        const couleur = COULEURS[c.id];
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            aria-pressed={active}
            style={{ background: active ? couleur.bg : "transparent" }}
            className="relative block w-full text-left px-5 py-4 border-b border-line last:border-b-0 font-body text-[1rem]
              transition-colors duration-200 hover:bg-paper
              max-md:flex-none max-md:min-w-[180px] max-md:border-b-0 max-md:border-r"
          >
            <span
              className="absolute left-0 top-0 bottom-0 transition-all duration-200"
              style={{ background: couleur.fg, opacity: active ? 1 : 0.25, width: active ? 4 : 3 }}
            />
            <span className={active ? "font-semibold" : ""}>{c.nom}</span>
            <small className="block font-display text-ink-faint text-[0.8rem] mt-1 leading-snug">{c.description}</small>
          </button>
        );
      })}
    </aside>
  );
}
