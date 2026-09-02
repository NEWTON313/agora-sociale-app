import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_URL = "https://monchoix2027.com";
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
  { href: "/", label: "Comparateur" },
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
        <header className="sticky top-0 z-[100] border-b border-line bg-white/85 backdrop-blur-md shadow-[0_1px_0_#1e3a5f]">
          <div className="max-w-[1180px] mx-auto px-6 flex items-baseline justify-between flex-wrap gap-2 pt-5 pb-3.5">
            <div className="font-display text-2xl font-bold tracking-tight">
              <span className="text-accent-bleu">Mon</span>{" "}
              <span className="font-normal text-ink-faint">Choix 2027</span>
            </div>
            <div className="font-mono text-[0.76rem] uppercase tracking-wide text-ink-faint max-[560px]:hidden">
              Projet citoyen · Open source · Présidentielle 2027
            </div>
          </div>
          <nav className="max-w-[1180px] mx-auto px-6 flex flex-nowrap gap-6 font-mono text-[0.8rem] uppercase tracking-wide pb-3.5 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap border-b-2 border-transparent hover:border-accent-bleu-soft text-ink-soft hover:text-accent-bleu pb-1 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/NEWTON313/agora-sociale-app"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap border-b-2 border-transparent hover:border-accent-bleu-soft text-ink-soft hover:text-accent-bleu pb-1 transition-colors"
            >
              Code source
            </a>
          </nav>
        </header>

        {children}

        <footer className="border-t border-ink py-7 font-mono text-[0.78rem] text-ink-faint">
          <div className="max-w-[1180px] mx-auto px-6">
            MON CHOIX 2027 — outil communautaire et open source. Aucun financement de parti, de candidat ou
            d&apos;annonceur.
          </div>
        </footer>
      </body>
    </html>
  );
}
