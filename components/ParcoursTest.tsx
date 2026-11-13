"use client";

import { useRef, useState } from "react";
import type { ClasseId } from "@/lib/data";
import BoussoleForm from "./BoussoleForm";
import SimulateurForm from "./SimulateurForm";

/**
 * Parcours unique en deux étapes : 1) la situation (catégorie sociale), 2) les choix (boussole) puis le résultat
 * croisé. Tout reste en mémoire dans le navigateur : rien n'est envoyé, stocké ni passé dans l'adresse.
 * Les deux étapes restent montées (simplement masquées) pour ne pas perdre les saisies en revenant en arrière.
 */
export default function ParcoursTest() {
  const [etape, setEtape] = useState<1 | 2>(1);
  const [classe, setClasse] = useState<ClasseId | null>(null);

  const etapes = useRef<HTMLElement>(null);

  // On ramène l'écran sur le fil des étapes (et non tout en haut de la page) : la personne arrive directement
  // sur l'étape, sans retraverser l'introduction. Le fil est placé au-dessus des deux étapes : sa position ne
  // dépend pas de celle qui est affichée, on peut donc défiler tout de suite.
  function aller(e: 1 | 2) {
    setEtape(e);
    etapes.current?.scrollIntoView({ block: "start" });
  }

  const pastille = (n: 1 | 2, label: string) => (
    <button
      type="button"
      onClick={() => aller(n)}
      aria-current={etape === n ? "step" : undefined}
      className={`flex min-h-[44px] items-center gap-2.5 font-display text-[0.92rem] ${etape === n ? "font-medium text-ink" : "text-ink-faint hover:text-ink-soft"}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.8rem] ${etape === n ? "bg-accent-bleu text-white" : "bg-paper-deep"}`}
      >
        {n}
      </span>
      {label}
    </button>
  );

  return (
    <>
      <nav
        ref={etapes}
        aria-label="Étapes du test"
        className="mb-8 flex scroll-mt-32 flex-wrap items-center gap-x-6 border-b border-line pb-2"
      >
        {pastille(1, "Votre situation")}
        <span aria-hidden="true" className="text-ink-faint">→</span>
        {pastille(2, "Vos choix")}
      </nav>

      <div hidden={etape !== 1}>
        <SimulateurForm
          onContinuer={(r) => {
            setClasse(r.classePrincipale);
            aller(2);
          }}
          onPasser={() => {
            setClasse(null);
            aller(2);
          }}
        />
      </div>
      <div hidden={etape !== 2}>
        <BoussoleForm classe={classe} onModifierSituation={() => aller(1)} />
      </div>
    </>
  );
}
