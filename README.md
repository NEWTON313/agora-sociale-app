# Mon Choix 2027 — version Next.js

Portage du prototype statique (`agora-sociale/`) vers Next.js 14 (App Router)
+ TypeScript + Tailwind CSS. À utiliser dès que le site a besoin de pages
générées par candidat/mesure, d'un CMS headless, ou d'un rendu serveur pour le
SEO sur des centaines de fiches.

## Arborescence

```
agora-sociale-next/
├── app/
│   ├── layout.tsx                  # En-tête, nav, polices (Server Component)
│   ├── globals.css                 # Tailwind + variables de police
│   ├── page.tsx                    # Accueil (monte le comparateur)
│   ├── simulateur/page.tsx
│   ├── methodologie/
│   │   ├── page.tsx
│   │   └── fiscalite-patrimoine/page.tsx
│   └── candidats/[id]/page.tsx     # Fiche dynamique, generateStaticParams (SSG)
├── components/
│   ├── ClasseRail.tsx              # Rail sticky de filtrage (Client Component)
│   ├── Ledger.tsx                  # Barre crédit/débit d'impact
│   ├── CarteCandidat.tsx
│   ├── ComparateurClasse.tsx       # Orchestrateur d'état (Client Component)
│   └── SimulateurForm.tsx          # Formulaire + résultat + règle graduée
├── lib/
│   ├── data.ts                     # Types + données (portage de data/data.js)
│   └── simulateur.ts               # Logique de classement (portage de js/simulateur.js)
├── tailwind.config.js              # Tokens de design (couleurs, polices)
├── package.json
└── tsconfig.json
```

## Choix d'architecture

- **Server Components par défaut** (`app/*/page.tsx`) : rendu au build ou à la
  requête, sans JS envoyé au client pour l'affichage statique (fiches
  candidats, méthodologie).
- **Client Components explicites** (`"use client"`) uniquement là où l'état
  interactif est nécessaire : `ComparateurClasse` (sélection classe/thème),
  `ClasseRail`, `SimulateurForm`. Tout le reste reste serveur.
- **`generateStaticParams`** sur `app/candidats/[id]/page.tsx` : chaque fiche
  candidat est pré-générée en HTML statique au build (SSG), pas recalculée à
  chaque visite — utile dès que le nombre de candidats/mesures grandit.
- **`lib/data.ts` et `lib/simulateur.ts`** sont du TypeScript pur, sans
  dépendance React : testables unitairement (Jest/Vitest) indépendamment de
  l'UI, contrairement à la version vanilla où tout vivait dans le DOM.

## ⚠️ Point d'attention technique : couleurs par classe sociale

Tailwind ne peut pas détecter des classes générées dynamiquement au runtime
(ex. `` `bg-${variable}` ``) car son moteur JIT scanne le code source de façon
statique au build. C'est pourquoi `ClasseRail.tsx`, `SimulateurForm.tsx` et la
fiche candidat utilisent des objets `COULEURS` en TypeScript avec des valeurs
hex passées en `style` inline, plutôt que des classes Tailwind dynamiques.

Piste d'amélioration : faire de `lib/data.ts` la source unique de vérité en y
ajoutant directement les valeurs hex (au lieu de dupliquer `tailwind.config.js`
et les objets `COULEURS` locaux à chaque composant).

## Installation

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production (SSG des fiches candidats)
```

## Publier ce dépôt sur GitHub

```bash
cd agora-sociale-next
git init
git add .
git commit -m "Premier commit : Mon Choix 2027 (Next.js)"
git branch -M main

# Crée d'abord un dépôt vide sur https://github.com/new (nom suggéré : agora-sociale-app)
# Ne coche PAS "Initialize with README" pour éviter un conflit d'historique.

git remote add origin https://github.com/TON-USERNAME/agora-sociale-app.git
git push -u origin main
```

### Déployer en ligne (Vercel, recommandé pour Next.js)

1. Va sur [vercel.com](https://vercel.com), connecte-toi avec ton compte GitHub
2. **Add New → Project**, sélectionne le dépôt `agora-sociale-app`
3. Vercel détecte Next.js automatiquement — laisse les réglages par défaut et clique **Deploy**
4. Le site est en ligne en 1 à 2 minutes, avec une URL du type
   `https://agora-sociale-app.vercel.app`, et se redéploie automatiquement à
   chaque `git push` sur `main`

Alternative : Netlify fonctionne aussi avec Next.js via son adaptateur officiel,
avec un flux de connexion de dépôt similaire.

## Ce qui reste à faire pour une mise en production réelle

1. Remplacer `lib/data.ts` par un chargement depuis un CMS headless ou des
   fichiers JSON versionnés dans Git (voir `README.md` du prototype vanilla
   pour les règles de collecte neutre des données).
2. Ajouter des tests unitaires sur `lib/simulateur.ts` (fonction pure, facile
   à tester : cas limites sur les seuils de décile, foyers nombreux, etc.).
3. Ajouter le `sitemap.xml` / métadonnées `generateMetadata` par candidat pour
   le SEO, une fois les vraies fiches candidats en place.
4. Reconnecter la table `SEUILS_NIVEAU_DE_VIE` (`lib/simulateur.ts`) à la
   prochaine publication annuelle de l'INSEE.
