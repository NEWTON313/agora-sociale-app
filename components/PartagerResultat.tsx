"use client";

import { useEffect, useState } from "react";
import type { ClasseId } from "@/lib/data";
import type { PoidsThemes } from "@/lib/priorites";
import { encoderPartage } from "@/lib/partage";

const TEXTE_PARTAGE = "Voici ce que donne le comparateur Mon Choix 2027 pour ma situation et mes priorités. À toi d'essayer :";

const boutonBase =
  "font-mono text-[0.78rem] uppercase tracking-wide px-4 py-2.5 rounded border transition-colors";
const boutonPrimaire = `${boutonBase} bg-accent-bleu text-paper-raised border-accent-bleu hover:bg-accent-bleu-soft`;
const boutonSecondaire = `${boutonBase} bg-paper-raised text-ink-soft border-line-strong hover:border-accent-bleu-soft hover:text-accent-bleu`;

export default function PartagerResultat({ classe, poids }: { classe: ClasseId; poids: PoidsThemes }) {
  const [ouvert, setOuvert] = useState(false);
  const [copie, setCopie] = useState(false);
  const [partageNatif, setPartageNatif] = useState(false);

  useEffect(() => {
    setPartageNatif(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const qs = encoderPartage(classe, poids);
  const urlImage = `/api/carte?${qs}`;
  const lienPartage = () => `${window.location.origin}/resultat?${qs}`;

  async function partager() {
    const url = lienPartage();
    try {
      // Sur mobile, joindre l'image permet de la poster telle quelle (stories, messageries).
      const reponse = await fetch(urlImage);
      const fichier = new File([await reponse.blob()], "mon-choix-2027.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [fichier] })) {
        await navigator.share({ files: [fichier], text: `${TEXTE_PARTAGE} ${url}` });
        return;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
    try {
      await navigator.share({ title: "Mon Choix 2027", text: TEXTE_PARTAGE, url });
    } catch {
      // Partage annulé par le visiteur : rien à faire.
    }
  }

  async function copierLien() {
    try {
      await navigator.clipboard.writeText(lienPartage());
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    } catch {
      window.prompt("Copiez ce lien :", lienPartage());
    }
  }

  if (!ouvert) {
    return (
      <div className="mt-6 flex flex-col items-start gap-2">
        <button type="button" onClick={() => setOuvert(true)} className={boutonPrimaire}>
          Partager mon résultat
        </button>
        <p className="text-[0.8rem] text-ink-soft max-w-[58ch]">
          Facultatif. Seuls votre catégorie sociale et vos priorités sont utilisées pour créer la carte : jamais
          votre revenu, votre âge ni votre patrimoine.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-paper-raised border border-line rounded-lg shadow-elevated animate-rise">
      <div className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft mb-3">Ma carte à partager</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={urlImage}
        alt="Carte de résultat : ma catégorie sociale, mes priorités et le classement complet des candidats selon ces priorités"
        width={1200}
        height={630}
        className="w-full h-auto border border-line rounded"
      />
      <p className="text-[0.8rem] text-ink-soft mt-3">
        La carte montre le classement complet et précise que ce n&apos;est pas une recommandation de vote. Elle
        n&apos;inclut ni votre revenu ni aucune donnée personnelle.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {partageNatif && (
          <button type="button" onClick={partager} className={boutonPrimaire}>
            Partager
          </button>
        )}
        <button type="button" onClick={copierLien} className={partageNatif ? boutonSecondaire : boutonPrimaire}>
          {copie ? "Lien copié ✓" : "Copier le lien"}
        </button>
        <a href={`${urlImage}&dl=1`} download="mon-choix-2027.png" className={`${boutonSecondaire} no-underline`}>
          Télécharger l&apos;image
        </a>
      </div>
    </div>
  );
}
