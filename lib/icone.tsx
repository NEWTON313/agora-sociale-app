/**
 * Icône de la marque, dessinée pour next/og (ImageResponse) : fond bleu du site, initiale blanche et bandeau
 * aux quatre couleurs des catégories sociales (la signature visuelle du site). Sert au favicon, à l'icône
 * Apple et aux icônes du manifeste.
 */
const COULEURS_CLASSES = ["#3d5a78", "#566f4d", "#7a4258", "#9c7539"];

export function IconeMarque({ taille }: { taille: number }) {
  const bandeau = Math.max(3, Math.round(taille * 0.14));
  return (
    <div style={{ width: taille, height: taille, display: "flex", flexDirection: "column", background: "#1e3a5f" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: Math.round(taille * 0.6),
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        M
      </div>
      <div style={{ display: "flex", height: bandeau }}>
        {COULEURS_CLASSES.map((c) => (
          <div key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
    </div>
  );
}
