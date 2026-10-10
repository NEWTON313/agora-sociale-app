import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { CANDIDATS, CLASSES_SOCIALES } from "@/lib/data";
import { classerCandidats } from "@/lib/priorites";
import { decoderPartage, themesPrioritaires } from "@/lib/partage";

const COULEURS_CLASSES: Record<string, string> = {
  populaires: "#3d5a78",
  moyennes: "#566f4d",
  aisees: "#7a4258",
  retraites: "#9c7539",
};

const BARRE_LARGEUR = 230;
const MAX_LIGNES = 12;
const HAUTEUR_LISTE = 420;

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const partage = decoderPartage({ classe: q.get("classe"), p: q.get("p") });
  if (!partage) return new Response("Paramètres invalides", { status: 400 });

  const classe = CLASSES_SOCIALES.find((c) => c.id === partage.classe)!;
  const couleurClasse = COULEURS_CLASSES[classe.id];
  const { classement, resultats } = classerCandidats(CANDIDATS, partage.classe, partage.poids);
  const priorites = themesPrioritaires(partage.poids, 3);

  // Avec beaucoup de candidats, la carte affiche ceux dont le score est calculable (au plus MAX_LIGNES, taille
  // adaptée) et résume les autres ; la liste complète reste toujours consultable sur le site.
  const calculables = classement.filter((c) => resultats.get(c.id)!.scoreGlobal !== null);
  const nonCalculables = classement.length - calculables.length;
  const lignes = calculables.slice(0, MAX_LIGNES);
  const restants = calculables.length - lignes.length;
  const hauteurLigne = Math.min(66, Math.floor(HAUTEUR_LISTE / Math.max(lignes.length, 1)));
  const compact = hauteurLigne < 54;

  const headers: Record<string, string> = {
    // Les données (scores) évoluent tous les quelques jours : cache court côté navigateur, plus long côté CDN.
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
  };
  if (q.get("dl") === "1") headers["Content-Disposition"] = 'attachment; filename="mon-choix-2027.png"';

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", background: "#eceef2", color: "#10131a" }}>
        <div style={{ display: "flex", height: 8 }}>
          <div style={{ flex: 1, background: "#3d5a78" }} />
          <div style={{ flex: 1, background: "#566f4d" }} />
          <div style={{ flex: 1, background: "#7a4258" }} />
          <div style={{ flex: 1, background: "#9c7539" }} />
        </div>

        <div style={{ display: "flex", flex: 1, padding: "36px 56px 20px", gap: 52 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 400, justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
                <span style={{ color: "#1e3a5f" }}>Mon</span>
                <span style={{ color: "#7a8090", marginLeft: 10 }}>Choix 2027</span>
              </div>

              <div style={{ display: "flex", marginTop: 44, fontSize: 17, color: "#7a8090", letterSpacing: 2 }}>MA CATÉGORIE</div>
              <div style={{ display: "flex", marginTop: 8, fontSize: 46, fontWeight: 700, color: couleurClasse, lineHeight: 1.1 }}>
                {classe.nom}
              </div>

              <div style={{ display: "flex", marginTop: 36, fontSize: 17, color: "#7a8090", letterSpacing: 2 }}>MES PRIORITÉS</div>
              <div style={{ display: "flex", flexDirection: "column", marginTop: 10, gap: 8 }}>
                {priorites.map((theme) => (
                  <div key={theme} style={{ display: "flex", fontSize: 25, lineHeight: 1.2 }}>
                    {theme}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", fontSize: 16, color: "#454e5e", lineHeight: 1.35 }}>
              Score calculé d&apos;après mes priorités et les mesures recensées — ce n&apos;est pas une recommandation de vote.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 14 }}>
            <div style={{ display: "flex", fontSize: 17, color: "#7a8090", letterSpacing: 2, marginBottom: 4 }}>
              CORRESPONDANCE AVEC MES PRIORITÉS
            </div>
            {lignes.map((candidat, i) => {
              const r = resultats.get(candidat.id)!;
              const score = r.scoreGlobal!;
              const largeur = (Math.min(Math.abs(score) / 2, 1) * BARRE_LARGEUR) / 2;
              const positif = score >= 0;
              return (
                <div key={candidat.id} style={{ display: "flex", alignItems: "center", height: hauteurLigne }}>
                  <div style={{ display: "flex", width: 34, fontSize: compact ? 20 : 26, fontWeight: 700, color: "#7a8090" }}>{i + 1}</div>
                  <div style={{ display: "flex", flexDirection: "column", width: 262 }}>
                    <div style={{ display: "flex", fontSize: compact ? 20 : 24, fontWeight: 700, lineHeight: 1.1 }}>{candidat.nom}</div>
                    {!compact && (
                      <div style={{ display: "flex", fontSize: 13, color: "#7a8090", letterSpacing: 1.2, marginTop: 3 }}>
                        {candidat.parti.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        width: BARRE_LARGEUR,
                        height: compact ? 12 : 16,
                        background: "#ffffff",
                        border: "1px solid #c9ced8",
                      }}
                    >
                      <div style={{ position: "absolute", left: BARRE_LARGEUR / 2 - 1, top: -1, bottom: -1, width: 1, background: "#10131a" }} />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          width: largeur,
                          left: positif ? BARRE_LARGEUR / 2 - 1 : BARRE_LARGEUR / 2 - 1 - largeur,
                          background: positif ? "#326049" : "#8f382f",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", width: 96, marginLeft: 14 }}>
                      <div style={{ display: "flex", fontSize: compact ? 18 : 22, fontWeight: 700, lineHeight: 1.1 }}>
                        {score > 0 ? "+" : ""}
                        {score.toFixed(1)}
                      </div>
                      {!compact && (
                        <div style={{ display: "flex", fontSize: 13, color: "#7a8090", marginTop: 3 }}>
                          {r.themesCouverts}/{r.themesPonderes} thème{r.themesPonderes > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {(nonCalculables > 0 || restants > 0) && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 6, fontSize: 15, color: "#454e5e", lineHeight: 1.35 }}>
                {restants > 0 && <div style={{ display: "flex" }}>+ {restants} autre{restants > 1 ? "s" : ""} candidat{restants > 1 ? "s" : ""} classé{restants > 1 ? "s" : ""} (liste complète sur le site)</div>}
                {nonCalculables > 0 && (
                  <div style={{ display: "flex" }}>
                    {nonCalculables} autre{nonCalculables > 1 ? "s" : ""} candidat{nonCalculables > 1 ? "s" : ""} : score non calculable (aucune mesure recensée)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 56px 24px", fontSize: 18, color: "#454e5e" }}>
          <div style={{ display: "flex" }}>Comparateur citoyen et non partisan · présidentielle 2027</div>
          <div style={{ display: "flex", fontWeight: 700, color: "#1e3a5f" }}>monchoix2027.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers }
  );
}
