import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { CANDIDATS_ALPHABETIQUE, CLASSES_SOCIALES } from "@/lib/data";
import { classerCandidats } from "@/lib/priorites";
import { decoderPartage, themesPrioritaires } from "@/lib/partage";

const COULEURS_CLASSES: Record<string, string> = {
  populaires: "#3d5a78",
  moyennes: "#566f4d",
  aisees: "#7a4258",
  retraites: "#9c7539",
};

/** Hauteur disponible pour la liste de candidats (le reste : titre, notes, pied de carte). */
const HAUTEUR_LISTE = 370;
const MAX_UNE_COLONNE = 10;
const MAX_PAR_COLONNE = 12;

/**
 * Carte de partage : catégorie sociale, thèmes prioritaires et EFFET ÉCONOMIQUE ESTIMÉ des mesures de chaque candidat
 * sur cette catégorie, du plus favorable au moins favorable (à égalité : ordre alphabétique ; les candidats sans effet
 * calculable ne sont jamais classés, ils sont résumés en note). Tous ceux dont l'effet est calculable apparaissent, sur
 * deux colonnes s'ils sont nombreux. La carte ne contient que
 * la catégorie et les thèmes prioritaires (jamais revenu, âge, patrimoine ni réponses de la boussole : un lien qui
 * encoderait des opinions permettrait aussi de fabriquer de fausses cartes).
 */
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const partage = decoderPartage({ classe: q.get("classe"), p: q.get("p") });
  if (!partage) return new Response("Paramètres invalides", { status: 400 });

  const classe = CLASSES_SOCIALES.find((c) => c.id === partage.classe)!;
  const couleurClasse = COULEURS_CLASSES[classe.id];
  const { classement, resultats } = classerCandidats(CANDIDATS_ALPHABETIQUE, partage.classe, partage.poids);
  const priorites = themesPrioritaires(partage.poids, 3);

  const calculables = classement.filter((c) => resultats.get(c.id)!.scoreGlobal !== null);
  const nonCalculables = CANDIDATS_ALPHABETIQUE.length - calculables.length;
  const colonnes = calculables.length > MAX_UNE_COLONNE ? 2 : 1;
  const affiches = calculables.slice(0, colonnes === 1 ? MAX_UNE_COLONNE : MAX_PAR_COLONNE * 2);
  const restants = calculables.length - affiches.length;
  const parColonne = Math.ceil(affiches.length / colonnes);
  const hauteurLigne = colonnes === 1 ? Math.min(60, Math.floor(HAUTEUR_LISTE / Math.max(affiches.length, 1))) : Math.min(34, Math.floor(HAUTEUR_LISTE / parColonne));
  const colonnesDonnees = Array.from({ length: colonnes }, (_, i) => affiches.slice(i * parColonne, (i + 1) * parColonne));

  const headers: Record<string, string> = {
    // Les données (scores) évoluent tous les quelques jours : cache court côté navigateur, plus long côté CDN.
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
  };
  if (q.get("dl") === "1") headers["Content-Disposition"] = 'attachment; filename="mon-choix-2027.png"';

  const barre = (score: number, largeurBarre: number, hauteurBarre: number) => {
    const largeur = (Math.min(Math.abs(score) / 2, 1) * largeurBarre) / 2;
    const positif = score >= 0;
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: largeurBarre,
          height: hauteurBarre,
          background: "#ffffff",
          border: "1px solid #c9ced8",
        }}
      >
        <div style={{ position: "absolute", left: largeurBarre / 2 - 1, top: -1, bottom: -1, width: 1, background: "#10131a" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: largeur,
            left: positif ? largeurBarre / 2 - 1 : largeurBarre / 2 - 1 - largeur,
            background: positif ? "#326049" : "#8f382f",
          }}
        />
      </div>
    );
  };

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

              <div style={{ display: "flex", marginTop: 36, fontSize: 17, color: "#7a8090", letterSpacing: 2 }}>MES THÈMES PRIORITAIRES</div>
              <div style={{ display: "flex", flexDirection: "column", marginTop: 10, gap: 8 }}>
                {priorites.map((theme) => (
                  <div key={theme} style={{ display: "flex", fontSize: 25, lineHeight: 1.2 }}>
                    {theme}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", fontSize: 16, color: "#454e5e", lineHeight: 1.35 }}>
              Estimation de l&apos;effet économique direct des mesures recensées sur ma catégorie, classée du plus favorable au
              moins favorable — ce n&apos;est ni un jugement sur les candidats ni une recommandation de vote.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "flex-start", paddingTop: 36 }}>
            <div style={{ display: "flex", fontSize: 17, color: "#7a8090", letterSpacing: 2, marginBottom: 14 }}>
              EFFET ÉCONOMIQUE ESTIMÉ SUR MA CATÉGORIE
            </div>

            <div style={{ display: "flex", gap: 32 }}>
              {colonnesDonnees.map((col, ci) => (
                <div key={ci} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  {col.map((candidat) => {
                    const r = resultats.get(candidat.id)!;
                    const score = r.scoreGlobal!;
                    const signe = `${score > 0 ? "+" : ""}${score.toFixed(1)}`;
                    return colonnes === 1 ? (
                      <div key={candidat.id} style={{ display: "flex", alignItems: "center", height: hauteurLigne }}>
                        <div style={{ display: "flex", flexDirection: "column", width: 296 }}>
                          <div style={{ display: "flex", fontSize: hauteurLigne < 52 ? 20 : 24, fontWeight: 700, lineHeight: 1.1, whiteSpace: "nowrap" }}>
                            {candidat.nom}
                          </div>
                          {hauteurLigne >= 52 && (
                            <div style={{ display: "flex", fontSize: 13, color: "#7a8090", letterSpacing: 1.2, marginTop: 3 }}>
                              {candidat.parti.toUpperCase()}
                            </div>
                          )}
                        </div>
                        {barre(score, 230, hauteurLigne < 52 ? 12 : 16)}
                        <div style={{ display: "flex", marginLeft: 14, width: 56, fontSize: hauteurLigne < 52 ? 18 : 22, fontWeight: 700 }}>{signe}</div>
                      </div>
                    ) : (
                      <div key={candidat.id} style={{ display: "flex", alignItems: "center", height: hauteurLigne }}>
                        <div style={{ display: "flex", width: 176, fontSize: 15, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden" }}>{candidat.nom}</div>
                        {barre(score, 64, 10)}
                        <div style={{ display: "flex", marginLeft: 8, width: 40, fontSize: 15, fontWeight: 700 }}>{signe}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {(nonCalculables > 0 || restants > 0) && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 12, fontSize: 15, color: "#454e5e", lineHeight: 1.35 }}>
                {restants > 0 && (
                  <div style={{ display: "flex" }}>
                    + {restants} autre{restants > 1 ? "s" : ""} candidat{restants > 1 ? "s" : ""} (liste complète sur le site)
                  </div>
                )}
                {nonCalculables > 0 && (
                  <div style={{ display: "flex" }}>
                    {nonCalculables} autre{nonCalculables > 1 ? "s" : ""} candidat{nonCalculables > 1 ? "s" : ""} : effet non calculable (aucune mesure recensée)
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
