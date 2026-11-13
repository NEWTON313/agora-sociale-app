import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mon Choix 2027",
    short_name: "Mon Choix 2027",
    description: "Comparateur citoyen, open source et non partisan des programmes de la présidentielle 2027.",
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ef",
    theme_color: "#1e3a5f",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
