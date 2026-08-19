# Site CSHP — règles du projet

Site vitrine statique du Centre Sportif de Haute-Performance (CSHP), école d'arts
martiaux à Saint-Léonard, Montréal. Remplace un WordPress à l'abandon dont
l'autopsie complète est dans `docs/audit-site-actuel.md` — chaque règle ci-dessous
répond à une erreur documentée de l'ancien site. Les lire avant de coder.

## Stack et commandes

- **Astro 5**, zéro framework front, CSS vanille avec design tokens (`src/styles/global.css`).
- Polices auto-hébergées (`public/fonts/`), images optimisées par `astro:assets` (WebP responsive).
- `npm run dev` · `npm run build` (obligatoire avant tout commit) · `npm run preview`.
- Déploiement cible : Cloudflare Pages. Aucune base de données, aucun backend, aucun abonnement.

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

- Le formulaire d'essai (`src/components/FormulaireEssai.astro`, partagé) poste vers
  `POST {club.apiLeads}` avec `{ name, phone, email, sport, message, provenance }`.
- ⚠️ **CORS à activer côté app** pour le domaine du site avant la mise en ligne
  (le formulaire affiche un repli téléphone/courriel en attendant).
- **Attribution des landing pages** : `provenance: 'RESEAUX_SOCIAUX'` (valeur sûre de
  l'enum de l'app) + le tag d'angle et les UTM joints au début du `message`
  (ex. `[karate-enfant] utm_campaign=rentree2026 | …`). Si l'app ajoute un jour des
  valeurs d'enum dédiées, changer la prop `provenance` des pages, rien d'autre.
- Détails : `docs/contexte-club.md`.

## Landing pages publicitaires et pixel Meta

- Une landing = une page dans `src/pages/essai-gratuit-*.astro` qui remplit les props
  de `LandingEssai.astro` (gabarit `Landing.astro` : pas de navigation, `noindex`).
  Trois angles en place : `karate-enfant`, `ninjas-4-8`, `kickboxing-femmes`.
- URLs de pub : ajouter les UTM (`?utm_campaign=…&utm_content=…`), capturés
  automatiquement dans le message du lead.
- **Pixel Meta** : `src/components/MetaPixel.astro`, activé en collant l'ID dans
  `src/data/marketing.json` (`metaPixelId`). Vide = aucun script tiers, aucun bandeau.
  Consentement préalable obligatoire (Loi 25) : bandeau Accepter/Refuser, choix
  mémorisé ; `PageView` après consentement, `Lead` à la soumission réussie du
  formulaire (`content_name` = tag de l'angle).

## Mise en ligne — checklist critique

1. Inventorier les DNS actuels AVANT tout changement : les enregistrements
   **Resend** (SPF/DKIM) du domaine servent les courriels transactionnels du club
   (reçus, rappels de paiement). Les casser = paiements manqués.
2. Implémenter la table de 301 (audit §Redirections).
3. Vérifier la cible des pubs Meta (l'ancienne landing est déjà une 404).
4. Récupérer les photos restantes listées dans `docs/inventaire-images.md`
   avant de résilier l'hébergement WordPress.

## Contenu et matériaux

- Texte réel de l'ancien site (à recycler, jamais à inventer) : `docs/contenu-site-actuel.md`.
- Inventaire des 176 images de l'ancien site : `docs/inventaire-images.md`.
- Photos retenues : `src/assets/photos/` (originaux 1600-1920 px, JPEG q82).
- **Décisions du propriétaire (2026-08-19)** : le cœur de clientèle = enfants
  de 5 à 9 ans → la première image de chaque page montre un enfant ; taekwondo
  retiré (non offert actuellement) ; quartier = **Rosemont** (pas Saint-Léonard) ;
  coachs judo = Randon Montoya et James Ekobena (Abdou Bouabdallah parti).
- Encore à trancher : l'âge exact du programme Ninjas (4-8 vs 5-8 vs 4-9).
