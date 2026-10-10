import { siglePartiDe } from "@/lib/parti";

/**
 * Badge d'étiquette : identique pour tous les candidats (même forme, taille et couleur neutre).
 * Décoratif : le nom complet de l'étiquette reste affiché en texte à côté.
 */
export default function BadgeParti({ parti, className = "" }: { parti: string; className?: string }) {
  const sigle = siglePartiDe(parti);
  if (!sigle) return null;
  return (
    <span
      aria-hidden="true"
      title={parti}
      className={`inline-flex shrink-0 items-center rounded-md border border-line-strong bg-paper-deep px-2 py-0.5 font-mono text-[0.72rem] font-medium uppercase tracking-[0.06em] leading-none text-accent-bleu ${className}`}
    >
      {sigle}
    </span>
  );
}
