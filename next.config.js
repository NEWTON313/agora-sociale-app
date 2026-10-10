const production = process.env.NODE_ENV === "production";

/**
 * En-têtes de sécurité appliqués à toutes les routes.
 * - CSP : scripts uniquement du site (le 'unsafe-inline' est requis par l'hydratation de Next.js sans nonce ;
 *   'unsafe-eval' seulement en développement), styles et polices de Google Fonts, aucune ressource tierce
 *   autrement. Vercel Analytics / Speed Insights passent par des routes du site (/_vercel/...).
 * - frame-ancestors 'none' + X-Frame-Options : le site ne peut pas être affiché dans un cadre tiers (clickjacking).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${production ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
