import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Polices servies par le site (fichiers dans app/fonts, licence OFL) : aucune requête vers un service tiers.
const fontDisplay = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
});
const fontBody = localFont({
  src: "./fonts/source-serif-4-latin-wght-normal.woff2",
  weight: "200 900",
  variable: "--font-body",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
const fontMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  fallback: ["Courier New", "monospace"],
});

const SITE_TITLE = "Mon Choix 2027";
const SITE_DESCRIPTION =
  "Comparateur citoyen, open source et non partisan des programmes des candidats à la présidentielle 2027 : mesure par mesure, avantages, risques et angle mort, selon votre catégorie sociale.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TITLE} — Comparateur des programmes de la présidentielle 2027`,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "programme présidentielle 2027",
    "programme candidats 2027",
    "comparateur programme candidat",
    "élection présidentielle 2027",
    "impact classe sociale",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_TITLE,
    title: `${SITE_TITLE} — Comparateur des programmes de la présidentielle 2027`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TITLE} — Comparateur des programmes de la présidentielle 2027`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f4ef",
};

// `court` : libellé affiché sur téléphone, pour que les quatre liens tiennent sur une ligne sans défilement.
const NAV = [
  { href: "/simulateur", label: "Le test", court: "Le test" },
  { href: "/candidats", label: "Fiches candidats", court: "Candidats" },
  { href: "/methodologie", label: "Méthodologie", court: "Méthode" },
  { href: "/transparence", label: "Transparence", court: "Transparence" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_TITLE,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              inLanguage: "fr-FR",
            }),
          }}
        />
      </head>
      <body className="bg-paper text-ink font-body text-[17px] leading-[1.6]">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-accent-bleu focus:px-4 focus:py-3 focus:font-display focus:text-white"
        >
          Aller au contenu
        </a>
        <div
          aria-hidden="true"
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(to right, #3d5a78 0%, #3d5a78 25%, #566f4d 25%, #566f4d 50%, #7a4258 50%, #7a4258 75%, #9c7539 75%, #9c7539 100%)",
          }}
        />
        <header className="sticky top-0 z-[100] border-b border-line bg-paper/85 backdrop-blur-xl">
          <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between flex-wrap gap-x-10 py-2 sm:py-3">
            <Link href="/" className="font-body text-[1.55rem] font-semibold tracking-[-0.02em] no-underline">
              <span className="text-accent-bleu">Mon</span> <span className="text-ink">Choix 2027</span>
            </Link>
            <nav
              aria-label="Navigation principale"
              className="flex w-full justify-between font-display text-[0.9rem] font-medium sm:w-auto sm:justify-start sm:gap-8 sm:text-[0.95rem]"
            >
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className="inline-flex min-h-[44px] items-center whitespace-nowrap text-ink-soft underline-offset-8 transition-colors hover:text-accent-bleu hover:underline"
                >
                  <span className="sm:hidden">{item.court}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main id="contenu">{children}</main>

        <footer className="border-t border-line bg-paper-deep">
          <div className="max-w-[1180px] mx-auto px-6 py-12 flex flex-wrap justify-between gap-x-12 gap-y-6">
            <div className="max-w-[52ch]">
              <div className="font-body text-[1.25rem] font-semibold tracking-[-0.015em] text-ink mb-2">Mon Choix 2027</div>
              <p className="font-display text-[0.92rem] leading-relaxed text-ink-soft">
                Outil communautaire et open source. Aucun financement de parti, de candidat ou d&apos;annonceur.
              </p>
            </div>
            <div className="flex flex-col gap-2 font-display text-[0.92rem] text-ink-faint">
              <div>Projet citoyen · Présidentielle 2027</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <Link href="/methodologie" className="underline underline-offset-4 hover:text-ink">Méthodologie</Link>
                <Link href="/transparence" className="underline underline-offset-4 hover:text-ink">Transparence</Link>
                <Link href="/mentions-legales" className="underline underline-offset-4 hover:text-ink">Mentions légales</Link>
              </div>
            </div>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
