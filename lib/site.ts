/**
 * Adresse publique du site, utilisée pour les canonical, le sitemap, robots.txt et les aperçus de partage.
 * Doit rester l'hôte servi directement : monchoix2027.com redirige (308) vers www.monchoix2027.com
 * côté Vercel, donc www est l'adresse canonique.
 */
export const SITE_URL = "https://www.monchoix2027.com";

/**
 * Image d'aperçu par défaut (app/opengraph-image.tsx). Une page qui redéfinit `openGraph` ou `twitter` dans ses
 * métadonnées n'hérite plus de l'image du site : elle doit la reprendre explicitement.
 */
export const IMAGE_APERCU = { url: "/opengraph-image", width: 1200, height: 630, alt: "Mon Choix 2027 — comparateur citoyen et non partisan" };
