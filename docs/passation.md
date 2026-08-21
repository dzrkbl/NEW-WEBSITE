# Passation : tout le contexte du projet pour reprendre sans poser de questions

**Dernière mise à jour : 21 août 2026.** Ce document permet à une personne ou une
IA de reprendre le projet à froid : contexte, décisions, architecture, incidents
résolus, débogage, et ce qui reste à faire. Lire `CLAUDE.md` (règles) avant de
coder ; ce fichier-ci donne le POURQUOI et l'historique.

---

## 1. Vue d'ensemble

- **Client** : Centre Sportif de Haute-Performance (CSHP), école d'arts martiaux
  pour enfants (cœur de clientèle : 5 à 9 ans) à Rosemont, Montréal.
  Propriétaire du projet : Leandro (compte GitHub `dzrkbl`).
- **Ce dépôt** : le site public `centresportifhp.com`. Site statique Astro 5,
  aucune base de données, aucun backend. **EN PRODUCTION depuis le 20 août 2026.**
- **L'autre dépôt** : `dzrkbl/GYM-MANAGEMENT` (public), l'app de gestion du club
  (« CSHP Gestion », Express + React + Prisma + Neon Postgres, déployée sur
  Render : `https://cshp-backend.onrender.com`). Elle a sa propre IA et sa propre
  documentation. Le site lui envoie les leads ; il ne stocke rien lui-même.
- **Objectif business du site** : générer des essais gratuits (le CTA unique),
  alimenter le CRM de l'app avec attribution marketing, et être maintenable en
  quelques minutes (l'ancien site WordPress était à l'abandon car trop pénible
  à modifier ; autopsie complète dans `audit-site-actuel.md`).

## 2. Chronologie de ce qui a été fait

| Date (2026) | Étape |
|---|---|
| 19 août | Audit complet de l'ancien WordPress (scrape intégral, mesures, table de 301). Artefact publié et `docs/audit-site-actuel.md`. |
| 19 août | Construction du site Astro v1 : accueil complet, design système, données réelles. |
| 19 août | Itérations design avec le propriétaire (voir §8, journal des décisions). |
| 19 août | Landing pages publicitaires + pixel Meta (dormant) + formulaire partagé. |
| 19 août | Alignement sur le contrat API réel de l'app (document d'intégration reçu de l'IA de l'app) : correction du payload, honeypot, page `/confidentialite/`, retrait de la landing kickboxing. Test de bout en bout : HTTP 201. |
| 20 août | Découverte : domaine, DNS et ancien site déjà chez Hostinger. Archive des 98 photos. `.htaccess`, page 404, workflow FTPS. |
| 20 août | Écrasement de l'ancien WordPress par le propriétaire (zip fourni). Incidents 403 et FTP résolus (voir §9). Site en production, toutes les vérifications passées. |
| 21 août | Déploiement automatique prouvé de bout en bout (`/version.txt`). |

## 3. Architecture du site

- **Stack** : Astro 5, zéro framework front, CSS vanille avec design tokens.
  `npm run dev` / `npm run build` (build obligatoire avant commit).
- **Pages** (`src/pages/`) : `index.astro` (accueil une page, sections ancrées),
  `essai-gratuit-karate-enfant.astro` et `essai-gratuit-ninjas.astro` (landings
  pub, gabarit sans navigation, `noindex`), `confidentialite.astro`, `404.astro`.
- **Sources uniques** (`src/data/`) : `club.json` (identité, adresse, heures,
  réseaux, URL de l'API leads), `tarifs.json` (250 $/790 $, taxes incluses,
  rabais famille), `horaires.json` (grille réelle des cours), `marketing.json`
  (`metaPixelId`, vide = pixel désactivé). RÈGLE ABSOLUE : aucun chiffre en dur
  dans les composants (l'ancien site affichait 740 $ pour un vrai tarif de 790 $).
- **Composants clés** (`src/components/`) :
  - `FormulaireEssai.astro` : LE formulaire partagé (accueil + landings). Voir §6.
  - `LandingEssai.astro` : corps paramétrable des landings (une nouvelle landing
    = une page de 20 lignes qui remplit ses props).
  - `MetaPixel.astro` : pixel Meta avec bandeau de consentement Loi 25. Inactif
    tant que `metaPixelId` est vide.
  - `Hero`, `Programmes`, `Club`, `Horaire`, `Competition`, `Tarifs`, `Coachs`,
    `Essai` : sections de l'accueil.
- **Design système** (`src/styles/global.css`) : palette « papier gi / encre /
  rouge dojo » (`--papier #FAF7F2`, `--encre #17181C`, `--rouge #C8102E`,
  `--rouge-vif #FF4B45` réservé aux fonds sombres). Motif signature : la barre
  des ceintures (blanche→noire) sous le header et le footer. Polices
  auto-hébergées (`public/fonts/`) : Big Shoulders Display (titres) et Hanken
  Grotesk (texte, y compris le wordmark CSHP du header). Interdits hérités de
  l'audit : le vert #39B54A et le bleu #003388 de l'ancien thème.
- **Photos** : `src/assets/photos/` (12 retenues, optimisées par `astro:assets`
  en WebP responsive). Banque complète de l'ancien site : `archives/photos-site-2026/`
  (98 fichiers, sauvegardés avant l'écrasement du WordPress).
- **Poids mesuré** : ~0,14 MB et ~13 requêtes au chargement initial (l'ancien
  site : 6,42 MB et 101 requêtes). Budget : < 500 KB par page.

## 4. Hébergement et déploiement (Hostinger)

- **Tout est chez Hostinger** : domaine, DNS, hébergement web (mutualisé,
  serveur derrière le CDN « hcdn »), courriel Titan. L'ancien WordPress a été
  écrasé le 20 août (sauvegarde hPanel faite par le propriétaire ; photos
  archivées dans ce dépôt).
- **Déploiement automatique** : `.github/workflows/deploiement-hostinger.yml`.
  Chaque push sur la branche construit le site et le téléverse par FTPS.
  Trois secrets GitHub (Settings → Secrets → Actions) : `HOSTINGER_FTP_SERVER`
  (l'ADRESSE IP du serveur, pas le domaine : le domaine résout vers le CDN qui
  ne sert pas le FTP), `HOSTINGER_FTP_USERNAME`, `HOSTINGER_FTP_PASSWORD`
  (définissable dans hPanel → Fichiers → Comptes FTP). Les valeurs vivent
  UNIQUEMENT dans les secrets GitHub, jamais dans le dépôt ni dans une conversation.
- **⚠️ PIÈGE documenté** : la racine de connexion du compte FTP principal EST
  déjà `public_html`. Le workflow déploie donc vers `server-dir: ./`. Avec
  `public_html/`, on crée un doublon `public_html/public_html/` (incident réel,
  résolu le 21 août).
- **Vérification de version** : chaque déploiement écrit
  `https://centresportifhp.com/version.txt` (commit court + date). C'est le
  premier réflexe de débogage : comparer avec `git log -1`.
- **Redirections et serveur** : `public/.htaccess` porte les 301 de TOUTES les
  anciennes URLs WordPress (table d'origine : `audit-site-actuel.md`), le HTTPS
  forcé, le domaine canonique sans www, `ErrorDocument 404 /404.html` et le
  cache immutable des ressources empreintées. Équivalent Cloudflare Pages
  conservé en secours : `docs/redirections-cloudflare-pages.txt`.
- **Déploiement manuel de secours** : `npm run build`, zipper le CONTENU de
  `dist/` (pas le dossier), téléverser dans `public_html` via le Gestionnaire
  de fichiers hPanel, extraire À LA RACINE (le gestionnaire extrait dans un
  sous-dossier nommé comme le zip : il faut ensuite déplacer le contenu vers
  `public_html`, fichiers cachés inclus, `.htaccess` surtout). Incident réel du
  20 août : 403 parce que le site était dans `public_html/cshp-site/`.
- **CDN Hostinger** : il met en cache, y compris des 404. Après un déploiement,
  une ressource peut mettre quelques minutes à refléter la réalité. Le hPanel a
  un bouton pour vider le cache.

## 5. DNS et courriels : LES INTERDITS

Inventaire complet du 20 août : `docs/dns-centresportifhp.md`. Résumé vital :

- **Ne JAMAIS toucher** aux MX Titan (boîtes courriel du club) ni aux 3
  enregistrements Resend : `resend._domainkey` TXT, `send` TXT, `send` MX.
  Ce sont eux qui portent les reçus et rappels de paiement envoyés aux parents
  par l'app de gestion. Les casser = paiements manqués.
- Le site n'a eu besoin d'AUCUN changement DNS (tout était déjà chez Hostinger).
- TXT `google-site-verification` présent : la Search Console est accessible.

## 6. Intégration avec l'app de gestion (les leads)

**Où vont les leads** : formulaire du site → `POST https://cshp-backend.onrender.com/api/leads`
(champ `apiLeads` de `club.json`) → table Lead de la base Neon de l'app → page
**Prospects** de l'app. Si aucun suivi en 3 jours, l'app envoie une relance
automatique à l'admin. Rien n'est stocké côté site.

**Contrat API RÉEL** (vérifié contre le code de l'app, 2026-08-19) : l'endpoint
accepte UNIQUEMENT `firstName`* `lastName`* `gender` `phone` `email` `sport`
`requestType` (ESSAI|RAPPEL|TARIFS|AUTRE) et le honeypot **`website` (présent et
vide, champ caché dans le formulaire)**. La validation zod SUPPRIME
silencieusement tout champ inconnu (elle ne rejette pas).

**Contrat CIBLE** (chantier côté app, PR #7 de leur dépôt) : `source`,
`utmSource`, `utmCampaign`, `utmContent`, `note`. Le formulaire du site envoie
DÉJÀ ces champs en plus du contrat réel : ils sont jetés par zod aujourd'hui et
seront captés automatiquement dès la fusion de la PR #7 côté app. **Aucun
changement à faire côté site à ce moment-là.** Valeurs de `source` :
`site-accueil`, `landing-karate-enfant`, `landing-ninjas-4-8`. Les UTM de l'URL
de la page sont capturés automatiquement par le script du formulaire.

**Test réalisé** : POST réel accepté (HTTP 201), lead créé avec
l'id `00db09ea-e95f-4e20-b7e7-cacb6a4168b7` (prénom TEST ; à supprimer de
Prospects s'il y est encore).

**CORS** : déjà ouvert côté app (`app.use(cors())` sans restriction). Rien à
activer. Chantier optionnel de sécurité côté app : le restreindre aux deux domaines.

**Valeurs de `sport`** envoyées : `KARATE`, `JUDO`, `NINJAS`, `KICKBOXING`,
`AUTRE` (affichées brutes dans Prospects).

## 7. Marketing : landings, UTM, pixel

- **Landings actives** : `/essai-gratuit-karate-enfant/` et
  `/essai-gratuit-ninjas/`. Gabarit sans navigation (une seule sortie : le
  formulaire), `noindex` (le SEO organique vit sur l'accueil), horaire filtré du
  programme, tarifs en une ligne. `/essai-gratuit-kickboxing-femmes/` a été
  **retirée** : le programme n'est pas confirmé dans l'offre actuelle ; ne
  jamais envoyer de pub vers un cours qui n'existe pas. La recréer prend
  15 minutes si le programme est décidé (le composant supporte
  `sportVerrouille` et `avecAge`).
- **URLs de pub** : ajouter `?utm_source=…&utm_campaign=…&utm_content=…`.
  Exemple bio TikTok :
  `https://centresportifhp.com/essai-gratuit-ninjas/?utm_source=tiktok&utm_campaign=rentree2026&utm_content=bio-tiktok`.
  Même vidéo republiée en Reel/Short : changer `utm_source` (instagram, youtube).
- **Pixel Meta** (`MetaPixel.astro`) : DORMANT tant que `metaPixelId` est vide
  dans `src/data/marketing.json`. Une fois l'ID collé : bandeau de consentement
  Loi 25 (Accepter/Refuser, mémorisé en localStorage, retrait possible sur
  `/confidentialite/`), `PageView` seulement après consentement, `Lead` avec
  `eventID` unique (prêt pour la déduplication CAPI) UNIQUEMENT après un 200 de
  l'API, `LeadFormEchec` (trackCustom) si l'API échoue.
- **Stratégie de campagne** (décision du 19 août, venant de l'équipe app) : la
  campagne C1 reste sur les formulaires instantanés Meta ; les landings servent
  à la fiche Google, aux QR codes, à la bio TikTok, à la réactivation (C2) et au
  retargeting de janvier.

## 8. Journal des décisions du propriétaire (à respecter)

1. **Cœur de clientèle : enfants de 5 à 9 ans.** La première image de chaque
   page montre un enfant (le parent doit s'identifier). Le hero actuel : deux
   enfants en plein échange de judo, les adultes cadrés sous la tête (recadrages
   dédiés desktop et mobile via `<picture>`).
2. **Quartier : Rosemont**, jamais Saint-Léonard (l'ancien site se trompait).
   Défini une seule fois dans `club.json`.
3. **Taekwondo retiré** (non offert actuellement). Coachs actuels : Ilyes Abdoun
   (karaté et kickboxing), Randon Montoya (judo), James Ekobena (judo), Lyna
   Abdoun (Ninjas U8). Abdou Bouabdallah et Anas Sghir : partis.
4. **Aucun tiret long (—) nulle part** : le propriétaire trouve que ça fait
   « écrit par une IA ». Réécrire avec virgules, deux-points, points. Les plages
   horaires s'écrivent « 16 h 30 à 21 h ».
5. **Wordmark CSHP** du header/footer en Hanken Grotesk espacé, pas en police
   display condensée.
6. **Pas de blogue** : décision assumée (l'ancien blogue était un cimetière de
   démo). Si un jour du contenu régulier existe (résultats de compétition),
   l'ajouter à ce moment-là seulement.
7. Header sombre (le logo, silhouette blanche + swoosh rouge, est conçu pour
   fond foncé).
8. **UN SEUL CTA : « Essai gratuit »**, bouton rouge, partout identique.
9. Encore à trancher : l'âge exact du programme Ninjas (le site dit 4-8, la doc
   de l'app dit 4-9, l'ancien site disait 5-8) et le sort du cardio-kickboxing
   femmes affiché sur l'accueil/horaire (présent sur l'ancien site, absent du
   système de gestion).

## 9. Incidents rencontrés et résolus (pour déboguer plus vite)

| Symptôme | Cause | Solution |
|---|---|---|
| 403 Forbidden sur tout le site après le premier téléversement | Le Gestionnaire hPanel extrait les zip dans un sous-dossier (`public_html/cshp-site/`), la racine n'avait pas d'index | Déplacer tout le contenu (fichiers cachés inclus) vers `public_html` |
| GitHub Actions : `FTPError: 530 Login incorrect` | Le mot de passe FTP n'est pas le mot de passe hPanel ; il faut le définir dans hPanel → Comptes FTP | Définir le mot de passe FTP et mettre à jour le secret |
| Run vert mais changements absents du site | `server-dir: public_html/` créait `public_html/public_html/` (la racine FTP EST public_html) | `server-dir: ./` (corrigé, commit `cedaf9d`) |
| Une ressource nouvellement déployée renvoie 404 | Cache du CDN Hostinger (il cache aussi les 404) | Attendre quelques minutes ou vider le cache dans le hPanel |
| Leads sans attribution dans Prospects | La PR #7 de l'app (contrat cible) n'est pas fusionnée | Fusionner la PR #7 côté GYM-MANAGEMENT |
| Formulaire : message de repli téléphone | L'API Render ne répond pas (plan gratuit endormi si UptimeRobot est cassé) ou payload invalide | Tester `curl -X POST .../api/leads` avec le contrat du §6 |
| `avertissement Node.js 20 deprecated` dans Actions | Avertissement GitHub sans conséquence | Ignorer (ou monter les versions d'actions un jour) |

Note pour une IA travaillant dans l'environnement Claude Code : la passerelle
réseau de ces environnements rejette l'empreinte TLS des navigateurs headless ;
curl fonctionne, Playwright vers l'extérieur non. Pour des captures d'écran,
servir le build en localhost et capturer là.

## 10. À faire (état au 21 août 2026)

1. **Fusionner la PR #7** du dépôt GYM-MANAGEMENT (attribution des leads).
   Ensuite, faire une soumission de test depuis une landing avec des UTM et
   vérifier que `source` et les UTM apparaissent dans Prospects.
2. **Supprimer le lead TEST** (`00db09ea…`, prénom TEST) de Prospects s'il y est encore.
3. **Pixel Meta** : créer le pixel (Gestionnaire d'événements Meta → Connecter
   des données → Web), coller l'ID dans `src/data/marketing.json`, pousser.
4. **Fiche Google Business** : mettre le lien du site (ou d'une landing avec
   `utm_source=google-fiche`), demander des avis aux familles fidèles.
5. **Search Console** (déjà vérifiée via TXT) : demander l'indexation de
   l'accueil. Un sitemap n'est PAS encore généré (une page indexable + landings
   noindex : faible priorité ; ajouter `@astrojs/sitemap` quand des pages
   dédiées existeront).
6. **Vidéo TikTok** : compte Entreprise requis pour le lien en bio ; lien du §7.
7. Vérifier que la **sauvegarde complète WordPress** (fichiers + BD) a bien été
   téléchargée depuis le hPanel avant l'écrasement (le propriétaire a dit avoir
   fait la sauvegarde ; confirmer qu'elle est stockée quelque part de sûr).
8. Plus tard : pages dédiées par programme pour le SEO (/cours/karate/ etc., en
   raffinant alors le `.htaccess`), témoignages réels de parents (avec
   consentement), DMARC (optionnel), restreindre le CORS côté app (optionnel),
   trancher les questions ouvertes du §8.9.

## 11. Où est quoi (accès et responsabilités)

- **Code du site** : ce dépôt, branche `claude/website-maintenance-redesign-x78nl2`
  (branche par défaut de fait ; une fusion vers `main` est cosmétique, le
  workflow écoute les deux).
- **Secrets** : uniquement dans GitHub → Settings → Secrets → Actions (les 3
  `HOSTINGER_FTP_*`). Aucun secret dans le code ni dans les docs.
- **hPanel Hostinger** : le propriétaire. Hébergement, DNS, comptes FTP,
  boîtes Titan, cache CDN, sauvegardes.
- **App de gestion et sa base** : dépôt GYM-MANAGEMENT, Render, Neon. C'est là
  que vivent les membres, les paiements et les leads. Aucune donnée de membre
  ne doit jamais entrer dans ce dépôt-ci (Loi 25).
- **Meta Business / TikTok / fiche Google** : le propriétaire.
