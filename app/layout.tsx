import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

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

const NAV = [
  { href: "/simulateur", label: "Simulateur" },
  { href: "/candidats/melenchon", label: "Fiches candidats" },
  { href: "/methodologie", label: "Méthodologie" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
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
        <div
          aria-hidden="true"
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(to right, #3d5a78 0%, #3d5a78 25%, #566f4d 25%, #566f4d 50%, #7a4258 50%, #7a4258 75%, #9c7539 75%, #9c7539 100%)",
          }}
        />
        <header className="sticky top-0 z-[100] border-b border-line bg-paper/85 backdrop-blur-xl">
          <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between flex-wrap gap-x-10 gap-y-2 py-4">
            <Link href="/" className="font-body text-[1.55rem] font-semibold tracking-[-0.02em] no-underline">
              <span className="text-accent-bleu">Mon</span> <span className="text-ink">Choix 2027</span>
            </Link>
            <nav className="flex flex-nowrap gap-8 font-display text-[0.95rem] font-medium overflow-x-auto">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap border-b-2 border-transparent py-1 text-ink-soft transition-colors hover:border-accent-bleu hover:text-accent-bleu"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}

        <footer className="border-t border-line bg-paper-deep">
          <div className="max-w-[1180px] mx-auto px-6 py-12 flex flex-wrap justify-between gap-x-12 gap-y-6">
            <div className="max-w-[52ch]">
              <div className="font-body text-[1.25rem] font-semibold tracking-[-0.015em] text-ink mb-2">Mon Choix 2027</div>
              <p className="font-display text-[0.92rem] leading-relaxed text-ink-soft">
                Outil communautaire et open source. Aucun financement de parti, de candidat ou d&apos;annonceur.
              </p>
            </div>
            <div className="font-display text-[0.92rem] text-ink-faint">Projet citoyen · Présidentielle 2027</div>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
