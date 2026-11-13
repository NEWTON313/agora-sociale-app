# Boussole des candidats — conception (brouillon à valider)

Objectif : classer les candidats selon la proximité entre **leurs propositions documentées** et **ce que la personne souhaite**, en
remplaçant le score « effet économique sur ma catégorie » comme critère principal. Le score économique actuel reste disponible à
part, sous un libellé exact (« effet économique estimé sur ma catégorie »).

## 1. Principe

- Le test pose une série de **choix entre deux propositions** (A ou B), formulées de façon symétrique. La personne choisit A, B ou
  « ni l'un ni l'autre / sans avis », puis indique l'importance de la question (1 à 3).
- Pour chaque candidat et chaque question, on enregistre sa position **seulement si elle est documentée** par une source de
  référence : A, B, ou « non documentée ».
- « Non documentée » n'est **jamais** traitée comme un désaccord : la question est simplement écartée pour ce candidat, et la
  couverture est affichée.

## 2. Calcul

Pour un candidat, sur les questions où la personne a choisi A ou B et où la position du candidat est documentée :

- accord : +importance ; désaccord : −importance ;
- **proximité** = somme pondérée / somme des importances, de −100 % (opposé sur tout) à +100 % (d'accord sur tout) ;
- affichage systématique de la couverture : « d'accord sur X questions sur Y où sa position est documentée (Y sur N posées) ».

Garde-fous :
- pas de classement pour un candidat dont les positions documentées couvrent moins de 3 questions répondues : il apparaît dans
  une liste à part « pas assez de positions documentées », jamais comme un mauvais score ;
- égalités : ordre alphabétique, jamais le nombre de mesures ni les sondages ;
- l'ordre d'affichage des options A/B est aléatoire pour chaque personne, et chaque position de référence (gauche/droite, etc.)
  est répartie de façon équilibrée entre A et B ;
- le classement complet reste toujours visible (aucun candidat masqué).

## 3. Données

Nouvelle structure par candidat : `positions: [{ question, choix: "A" | "B", source, niveauConfiance, noteConfiance }]`.
Mêmes règles de sourcing que pour les mesures (médias de référence, jamais d'extrapolation, « case vide > déduction »).
Les mesures déjà recensées servent de point de départ ; la routine recherchera ensuite, question par question, la position de
chaque candidat (un travail plus systématique que la recherche libre de mesures).

## 4. Banque de questions — premier jet (22 questions, 2 par thème, 11 thèmes)

Les libellés sont à relire attentivement : chaque mot compte pour la neutralité.

| # | Thème | Option A | Option B |
|---|---|---|---|
| 1 | Pouvoir d'achat et économie | Relever fortement le Smic par la loi | Laisser les salaires évoluer par la négociation, sans hausse légale forte du Smic |
| 2 | Pouvoir d'achat et économie | Baisser les impôts sur les entreprises et le capital pour encourager l'investissement | Maintenir ou augmenter les impôts sur les plus hauts revenus et patrimoines pour financer la dépense publique |
| 3 | Retraites et modèle social | Revenir à un âge légal de départ plus bas qu'aujourd'hui | Maintenir l'âge légal actuel ou le repousser, pour équilibrer le système |
| 4 | Retraites et modèle social | Introduire une part de retraite par capitalisation | Conserver un système entièrement par répartition |
| 5 | Immigration et intégration | Restreindre ou supprimer le droit du sol | Maintenir le droit du sol actuel |
| 6 | Immigration et intégration | Fixer des quotas annuels d'immigration, votés par le Parlement | Ne pas fixer de plafond chiffré d'entrées |
| 7 | Sécurité et justice | Durcir les sanctions et accélérer les procédures pour les mineurs délinquants | Privilégier l'éducation et la prévention pour les mineurs délinquants |
| 8 | Sécurité et justice | Construire davantage de places de prison | Développer les peines alternatives à la prison |
| 9 | Services publics | Réduire le nombre de fonctionnaires et la dépense publique | Recruter dans l'hôpital, l'école et les services publics, quitte à augmenter la dépense |
| 10 | Services publics | Réguler l'installation des médecins pour garantir l'accès aux soins | Favoriser l'installation par des incitations, sans contrainte |
| 11 | Écologie et énergie | Développer le nucléaire en priorité | Sortir progressivement du nucléaire au profit des énergies renouvelables |
| 12 | Écologie et énergie | Imposer des normes écologiques plus contraignantes | Privilégier l'incitation et l'innovation plutôt que de nouvelles contraintes |
| 13 | Souveraineté et industrie | Protéger la production nationale (droits de douane, préférence nationale ou européenne) | Favoriser le libre-échange et la concurrence internationale |
| 14 | Souveraineté et industrie | Placer des secteurs stratégiques sous contrôle public | Laisser le secteur privé les gérer, sous régulation |
| 15 | Institutions et démocratie | Instaurer un référendum d'initiative citoyenne | Conserver la démocratie représentative, sans RIC |
| 16 | Institutions et démocratie | Introduire une part de proportionnelle aux législatives | Conserver le scrutin majoritaire |
| 17 | Europe et géopolitique | Sortir de l'Union européenne ou de l'euro | Rester dans l'Union européenne et l'euro |
| 18 | Europe et géopolitique | Renforcer l'intégration européenne (budget commun, compétences partagées) | Redonner des compétences aux États, sans nouvelle intégration |
| 19 | Éducation et jeunesse | Donner plus d'autonomie aux établissements scolaires (recrutement, organisation) | Maintenir un cadre national identique pour tous les établissements |
| 20 | Éducation et jeunesse | Instaurer un service national obligatoire pour les jeunes | Conserver un engagement uniquement volontaire |
| 21 | Défense | Augmenter fortement le budget de la défense | Maintenir l'effort de défense actuel, ou le réduire au profit d'autres priorités |
| 22 | Défense | Rester membre de l'OTAN | Quitter l'OTAN ou son commandement intégré |

Remarques sur les thèmes :
- « Éducation et jeunesse » et « Défense » s'ajoutent aux 9 thèmes d'origine, d'après les catégories d'un comparateur de référence
  (utilisé comme piste de recherche seulement, jamais comme source). Ils servent uniquement au test : les 9 thèmes du score
  « effet économique sur ma catégorie » ne changent pas.
- Les questions 17 (sortie de l'UE ou de l'euro) et 22 (OTAN) peuvent se recouper chez certains candidats qui défendent un
  « Frexit » complet ; chaque position reste enregistrée question par question, avec sa propre source.

## 5. Limites à assumer sur le site

- Un choix binaire simplifie des positions nuancées ; chaque position renvoie à sa source.
- Un candidat peut défendre une position non couverte par les 18 questions ; le test ne mesure que ce qu'il pose.
- Les positions sont codées à partir de la presse par une IA, relues par un humain avant publication.
- Au départ, peu de candidats auront des positions documentées sur beaucoup de questions : la couverture sera affichée et
  progressera avec le temps.

## 6. Évolutions du 13 novembre 2026 (phase 1 de la feuille de route)

- **Indice de proximité prudent.** Le classement ne se fait plus sur l'accord brut mais sur
  `indice = Σ(±importance) / (Σ importance + K_PRUDENCE)`, avec `K_PRUDENCE = 6` (trois questions d'importance moyenne
  sans accord ni désaccord). But : qu'un accord sur 3 questions sur 3 (indice +50) ne passe plus devant un accord sur 7
  questions sur 8 (indice +55). L'accord brut reste calculé (`score`) et le nombre de questions documentées est affiché.
- **Sources et validation des positions.** Les équipes de campagne ne sont pas sollicitées. Chaque position porte un
  niveau calculé : « officielle » (programme ou site officiel lu directement), « recoupée » (au moins deux médias de
  domaines différents) ou « unique » (une seule source de presse, affichée « à recouper »). Champs ajoutés dans
  `lib/positions.ts` : `typeSource`, `dateSource`, `citation`, `recoupements[]`.
- **Programme officiel d'abord.** Quand un candidat publie son programme, il devient la source de référence et la
  citation exacte est enregistrée (premier cas : « L'Avenir en commun », 6 novembre 2026).
- **Détail explicable.** Le résultat affiche, pour chaque question, le choix de la personne, la position du candidat,
  la mesure, la citation, les sources datées et le niveau de validation.
