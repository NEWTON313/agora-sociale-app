import { ImageResponse } from "next/og";
import { CANDIDATS } from "@/lib/data";
import { QUESTIONS } from "@/lib/boussole";

export const alt = "Mon Choix 2027 — comparateur citoyen et non partisan des programmes de la présidentielle 2027";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image d'aperçu par défaut du site (liens partagés vers l'accueil, les fiches, la méthodologie…). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", background: "#f6f4ef", color: "#10131a" }}>
        <div style={{ display: "flex", height: 10 }}>
          <div style={{ flex: 1, background: "#3d5a78" }} />
          <div style={{ flex: 1, background: "#566f4d" }} />
          <div style={{ flex: 1, background: "#7a4258" }} />
          <div style={{ flex: 1, background: "#9c7539" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "64px 72px 0" }}>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>
            <span style={{ color: "#1e3a5f" }}>Mon</span>
            <span style={{ marginLeft: 12 }}>Choix 2027</span>
          </div>

          <div style={{ display: "flex", marginTop: 72, fontSize: 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 960 }}>
            Quels candidats sont proches de vos choix ?
          </div>

          <div style={{ display: "flex", marginTop: 36, fontSize: 30, color: "#454e5e", lineHeight: 1.35, maxWidth: 940 }}>
            {CANDIDATS.length} candidats · {QUESTIONS.length} questions · sources citées · aucune donnée conservée
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 72px 44px", fontSize: 24, color: "#454e5e" }}>
          <div style={{ display: "flex" }}>Comparateur citoyen et non partisan · présidentielle 2027</div>
          <div style={{ display: "flex", fontWeight: 700, color: "#1e3a5f" }}>monchoix2027.com</div>
        </div>
      </div>
    ),
    size
  );
}
