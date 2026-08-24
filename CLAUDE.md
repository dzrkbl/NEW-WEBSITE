# Site CSHP — règles du projet

Site vitrine statique du Centre Sportif de Haute-Performance (CSHP), école d'arts
martiaux à Saint-Léonard, Montréal. Remplace un WordPress à l'abandon dont
l'autopsie complète est dans `docs/audit-site-actuel.md` — chaque règle ci-dessous
répond à une erreur documentée de l'ancien site. Les lire avant de coder.

## Stack et commandes

- **Astro 5**, zéro framework front, CSS vanille avec design tokens (`src/styles/global.css`).
- Polices auto-hébergées (`public/fonts/`), images optimisées par `astro:assets` (WebP responsive).
- `npm run dev` · `npm run build` (obligatoire avant tout commit) · `npm run preview`.
- **Déploiement : Hostinger** (hébergement existant du club — domaine, DNS et ancien
  WordPress y sont déjà, voir `docs/dns-centresportifhp.md`). Redirections via
  `public/.htaccess` ; auto-déploiement FTPS par GitHub Actions
  (`.github/workflows/deploiement-hostinger.yml`, 3 secrets à configurer).
  Procédure complète : `docs/deploiement.md`. Aucune base de données, aucun backend.

## Règles absolues (héritées de l'audit)

1. **Sources uniques** : tout chiffre d'affaires public vit dans `src/data/` —
   `tarifs.json` (250 $/790 $, aligné sur le système de gestion), `horaires.json`,
   `club.json` (adresse, téléphone, heures, réseaux). Ne JAMAIS écrire un prix,
   un horaire ou une coordonnée en dur dans un composant. L'ancien site affichait
   740 $ pour un tarif réel de 790 $ : c'est le bug qu'on interdit structurellement.
2. **Aucun contenu placeholder, jamais.** Pas de lorem, pas de faux témoignage,
   pas de page « à venir ». Une page sans contenu réel n'est pas committée.
3. **Français partout** : slugs, titres, meta, alt. Vouvoiement pour les parents.
4. **Budget de poids : < 500 KB par page au chargement initial.** Photos via
   `astro:assets` uniquement (jamais `<img>` brut), max 2 familles de polices.
   L'ancien site pesait 6,4 MB — c'est la contre-référence.
5. **Le site doit se lire sans JavaScript.** Le JS est un rehaussement
   (révélations au scroll, burger, envoi du formulaire) — jamais porteur de contenu.
6. **UN SEUL CTA canonique : « Essai gratuit »** (visuel : bouton rouge). Pas de
   synonymes (« rejoignez-nous », « essayer maintenant », etc.).
7. **URLs françaises stables.** Toute page supprimée ou renommée reçoit une
   redirection 301. La table de migration complète est dans
   `docs/audit-site-actuel.md` §Redirections — à implémenter au déploiement
   (`public/_redirects` pour Cloudflare Pages).
8. **Design tokens seulement** : couleurs et polices viennent des variables de
   `global.css` (`--rouge`, `--encre`, `--papier`…). Aucune couleur en dur dans
   les composants. Le vert #39B54A et le bleu #003388 de l'ancien thème sont bannis.
9. **SEO local** : chaque page a title + meta description uniques ciblant
   « karaté/judo enfant Montréal / Rosemont » (quartier réel — jamais revendiquer
   un quartier où le club n'est pas). Le JSON-LD `SportsActivityLocation` vit
   dans `src/layouts/Base.astro` et lit `club.json`.
10. **Vie privée (Loi 25)** : aucune donnée de membre dans ce dépôt. Les
    formulaires envoient vers l'app de gestion, rien n'est stocké ici.

## Intégration avec l'app de gestion (CSHP Gestion)

- **Contrat API réel de `POST {club.apiLeads}`** (vérifié contre le code de l'app,
  2026-08-19) : accepte UNIQUEMENT `firstName`* `lastName`* `gender` `phone` `email`
  `sport` `requestType` (ESSAI|RAPPEL|TARIFS|AUTRE) et le honeypot **`website`
  (présent et vide)**. Zod supprime silencieusement tout champ inconnu.
- Le formulaire (`src/components/FormulaireEssai.astro`, partagé) envoie ce contrat
  PLUS le **contrat cible, ACTIF depuis le 2026-08-21** (PR #7 fusionnée côté app) :
  `source` (`site-accueil` / `landing-<tag>`), `utmSource`, `utmCampaign`,
  `utmContent`, `note` (âge + message). Persistés et affichés dans Prospects ;
  vérifié de bout en bout.
- **CORS : déjà ouvert côté app** (`app.use(cors())` sans restriction). Rien à activer ;
  le chantier éventuel (sécurité) serait de le restreindre aux deux domaines.
- Détails : `docs/contexte-club.md`.

## Landing pages publicitaires et pixel Meta

- Une landing = une page dans `src/pages/essai-gratuit-*.astro` qui remplit les props
  de `LandingEssai.astro` (gabarit `Landing.astro` : pas de navigation, `noindex`).
  Angles en place : `karate-enfant`, `ninjas-4-8`. **`kickboxing-femmes` : le
  programme est confirmé par le propriétaire (2026-08-24)**, l'interdiction du
  2026-08-19 est levée. Le cours figure à l'horaire (jeudi 19 h 30, dimanche 10 h)
  et sur l'accueil ; la landing reste à recréer si un besoin de pub apparaît
  (le composant supporte déjà `sportVerrouille`/`avecAge`). La règle de fond ne
  change pas : ne jamais envoyer de pub vers un cours qui n'existe pas.
- URLs de pub : ajouter les UTM (`?utm_source=…&utm_campaign=…&utm_content=…`),
  captés avec le lead et visibles dans Prospects. **Tous les liens publiés
  (bios, fiche Google, QR, SMS) vivent dans `docs/liens-marketing.md`** : source
  unique, ne pas improviser de lien ailleurs.
- **Pixel Meta** : `src/components/MetaPixel.astro`, activé en collant l'ID dans
  `src/data/marketing.json` (`metaPixelId`). Vide = aucun script tiers, aucun bandeau.
  Consentement préalable obligatoire (Loi 25) : bandeau Accepter/Refuser, choix
  mémorisé (retrait possible sur `/confidentialite/`) ; `PageView` après consentement,
  `Lead` avec `eventID` unique (déduplication CAPI) uniquement après un 200 de l'API,
  `LeadFormEchec` (trackCustom) si l'API échoue.
- **Stratégie de campagne** (décision 2026-08-19) : la campagne C1 reste sur les
  formulaires instantanés Meta ; les landings servent à la fiche Google, aux QR codes,
  à la réactivation (C2) et au retargeting de janvier.

## Mise en ligne — checklist critique

1. ~~Inventorier les DNS actuels~~ **FAIT** (2026-08-20, `docs/dns-centresportifhp.md`) :
   tout est chez Hostinger ; ne JAMAIS supprimer les MX Titan ni les 3
   enregistrements Resend (`resend._domainkey` TXT, `send` TXT, `send` MX).
2. ~~Implémenter la table de 301~~ **FAIT** (`public/.htaccess`).
3. Vérifier la cible des pubs Meta (l'ancienne landing est déjà une 404).
4. ~~Récupérer les photos~~ **FAIT** (2026-08-20, `archives/photos-site-2026/`,
   98 fichiers). La sauvegarde complète WordPress (fichiers + BD) reste à
   télécharger depuis le hPanel avant l'écrasement.

## Passation

Historique complet, décisions, incidents résolus, débogage et tâches en cours :
`docs/passation.md`. C'est le premier fichier à lire pour reprendre le projet.

## Contenu et matériaux

- Texte réel de l'ancien site (à recycler, jamais à inventer) : `docs/contenu-site-actuel.md`.
- Inventaire des 176 images de l'ancien site : `docs/inventaire-images.md`.
- Photos retenues : `src/assets/photos/` (originaux 1600-1920 px, JPEG q82).
- **Décisions du propriétaire (2026-08-19)** : le cœur de clientèle = enfants
  de 5 à 9 ans → la première image de chaque page montre un enfant ; taekwondo
  retiré (non offert actuellement) ; quartier = **Rosemont** (pas Saint-Léonard) ;
  coachs judo = Randon Montoya et James Ekobena (Abdou Bouabdallah parti).
- Encore à trancher : l'âge exact du programme Ninjas (4-8 vs 5-8 vs 4-9).
