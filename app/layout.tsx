import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "L'Agora Sociale — Comparateur citoyen, présidentielle 2027",
  description:
    "Un outil citoyen, open source et non partisan pour comparer l'impact des programmes présidentiels sur les différentes classes sociales.",
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
        <header className="sticky top-0 z-[100] border-b border-line bg-white/85 backdrop-blur-md shadow-[0_1px_0_#10131a]">
          <div className="max-w-[1180px] mx-auto px-6 flex items-baseline justify-between flex-wrap gap-2 pt-5 pb-3.5">
            <div className="font-display text-2xl font-bold tracking-tight">
              L&apos;Agora <span className="font-normal text-ink-faint">Sociale</span>
            </div>
            <div className="font-mono text-[0.76rem] uppercase tracking-wide text-ink-faint">
              Projet citoyen · Open source · Présidentielle 2027
            </div>
          </div>
          <nav className="max-w-[1180px] mx-auto px-6 flex gap-6 font-mono text-[0.8rem] uppercase tracking-wide pb-3.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b-2 border-transparent hover:border-line-strong text-ink-soft hover:text-ink pb-1 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b-2 border-transparent hover:border-line-strong text-ink-soft hover:text-ink pb-1 transition-colors"
            >
              Code source
            </a>
          </nav>
        </header>

        {children}

        <footer className="border-t border-ink py-7 font-mono text-[0.78rem] text-ink-faint">
          <div className="max-w-[1180px] mx-auto px-6">
            L&apos;AGORA SOCIALE — outil communautaire et open source. Aucun financement de parti, de candidat ou
            d&apos;annonceur.
          </div>
        </footer>
      </body>
    </html>
  );
}
