# Audit du site actuel — centresportifhp.com

**Date :** 19 août 2026
**Méthode :** analyse par index de recherche (Google). L'accès HTTP direct au domaine est bloqué par la politique réseau de l'environnement d'exécution ; chaque constat cite donc les URLs indexées qui le prouvent. Un second passage (captures d'écran, PageSpeed, crawl complet) est possible en ouvrant l'accès réseau.
**Objectif :** documenter les erreurs du site actuel pour ne pas les reproduire dans le nouveau site (ce dépôt).

---

## Verdict

Le site actuel est un thème WordPress payant (« F7 – Fitness Gym » de VamTam) dont **le contenu de démonstration n'a jamais été entièrement nettoyé** : blog de démo en anglais, faux témoignages, pages de services fictifs. Ce n'est pas de la négligence — c'est le symptôme d'une architecture où chaque modification coûte cher (admin WordPress + Elementor, peur de casser la mise en page). Le problème de maintenance est **structurel**, pas humain. Le nouveau site doit d'abord éliminer ce coût de modification.

## La stack actuelle (identifiée)

| Composant | Rôle | Coût de maintenance |
|---|---|---|
| WordPress + MySQL + PHP | CMS, contenu en base de données | Mises à jour de sécurité constantes, rien n'est versionné |
| Thème « F7 – Fitness Gym » (VamTam, ThemeForest, 89 $US) | Design | Mises à jour liées à la licence ; générique « gym », pas arts martiaux |
| Elementor + Elementor Pro (requis par F7) | Éditeur visuel | Abonnement annuel ; contenu enfermé dans des blobs JSON en BD — inéditables hors admin |
| WooCommerce (requis par F7) | Boutique | Plugin lourd installé même sans boutique active |
| WPForms, Yoast SEO | Formulaires, SEO | Deux plugins de plus à tenir à jour |

**Preuve du thème :** la page « Personal Training » contient encore le texte de démo qui parle de « F7 », la marque fictive de la démo du thème (`/index.php/personal-training/`).

## Constats

### C1 — CRITIQUE · Le contenu de démonstration du thème est encore en ligne
Le blog est celui de la démo F7, en anglais, avec des articles génériques de fitness dont un qui parle des effets de la **pandémie de COVID** sur la santé mentale (donc du contenu daté ~2020‑2021 encore publié en 2026). Catégories indexées : « Fitness », « Healthy Living », « Workout Routines » ; tag « Routine ».
Preuves : `/index.php/blog/`, `/index.php/category/healthy-living/`, `/index.php/category/workout-routines/`, `/index.php/tag/routine/`.

### C2 — CRITIQUE · Faux témoignages publiés
La page « Reviews » affiche les témoignages de démonstration du thème, en anglais, attribués à des personnes fictives (ex. « Elva Daniels »). De faux avis clients sur un site commercial réel : risque de confiance et d'image majeur vis‑à‑vis des parents.
Preuve : `/index.php/reviews/`.

### C3 — MAJEUR · Site franco-anglais par accident
Le site vise des parents francophones mais les titres de pages indexés sont en anglais : « Team », « Classes », « Boxing », « Reviews », « Privacy Policy », « Personal Training »… et un hybride « Termes & Conditions ». Le funnel n'est cohérent dans aucune des deux langues.
Preuves : titres Google de `/index.php/team/`, `/index.php/classes/`, `/index.php/terms-conditions/`, etc.

### C4 — MAJEUR · URLs dégradées et contenu dupliqué (SEO)
Toutes les URLs contiennent `/index.php/` (permaliens WordPress en mode dégradé). Pire : les deux variantes sont indexées en parallèle (`/category/fitness/` **et** `/index.php/category/fitness/`) — contenu dupliqué, autorité de lien diluée.

### C5 — MAJEUR · Ni horaires ni tarifs trouvables
Aucune information d'horaire ou de tarif n'est visible dans l'index de recherche : tout passe par « remplissez le formulaire, on vous rappelle ». Un parent qui compare des clubs le soir ne peut pas s'auto‑renseigner. C'est aussi un symptôme : quand publier un horaire dans Elementor est pénible, on ne le publie pas.

### C6 — MAJEUR · Offre illisible
Les pages réelles (karaté, judo, taekwondo, NINJAS 5‑8 ans, camp d'été, parascolaire) cohabitent avec les pages de démo du thème (« Boxing », « Personal Training » virtuel de F7, catégories fitness). Un visiteur ne peut pas distinguer l'offre réelle des restes de gabarit.

### C7 — MINEUR · Localisation incohérente
Selon les pages, le club est « au cœur de Saint‑Léonard » ou « au cœur de Montréal » (et le quartier réel est Rosemont/Saint‑Léonard selon la source). À unifier — c'est aussi un facteur de SEO local.

### C8 — MINEUR · Une page publique s'appelle « Landing Page »
`/index.php/landing-page/` est indexée dans Google sous le titre « Landing Page – Centre Sportif de Haute‑Performance ». C'est probablement la page de destination des pubs Meta : son nom technique est visible des visiteurs et de Google.

### C9 — MINEUR · Archives de tags/catégories indexées
Les pages d'archives (`/tag/routine/`, `/category/...`) sont indexées : du contenu maigre et dupliqué qui dilue la pertinence du site pour les vraies requêtes (« karaté enfant Montréal »).

### Performance — non mesurée, risque structurel
PageSpeed n'a pas pu être exécuté depuis cet environnement (accès réseau restreint + quota API). Structurellement, la pile Elementor Pro + WooCommerce + thème premium charge plusieurs bundles CSS/JS, jQuery et bibliothèques de sliders : ce type de site dépasse rarement 50/100 en performance mobile. À mesurer au second passage.

## Ce qui marche (à garder)

- **Le titre SEO de l'accueil** : « Karaté, Judo, Taekwondo à Montréal | CSHP » — bien ciblé, à conserver.
- **Le CTA « essai gratuit »** avec formulaire de rappel : le bon réflexe de conversion, à garder comme CTA principal unique.
- **Le programme « NINJAS » (5‑8 ans)** : un vrai nom de marque interne, différenciant.
- **L'offre réelle est claire une fois isolée** : karaté, judo, taekwondo, NINJAS, camp d'été, parascolaire, essai gratuit.
- **~2 150 abonnés Facebook** : l'audience existe ; c'est le site qui ne suit pas.

## Leçons → règles pour le nouveau site

| # | Erreur du site actuel | Règle pour le nouveau site |
|---|---|---|
| 1 | Contenu en base de données, éditable seulement via admin/Elementor | Contenu = fichiers `.md`/`.json` dans git ; zéro base de données, zéro admin |
| 2 | Contenu de démo publié faute de nettoyage | Aucun contenu placeholder ne sera jamais committé ; schémas Zod : un frontmatter invalide ou manquant = build cassé |
| 3 | Faux témoignages du thème | Témoignages uniquement réels, avec consentement, en français |
| 4 | Mélange FR/EN accidentel | FR partout par défaut (titres, slugs, pages légales) ; l'EN sera une décision explicite, jamais un reste |
| 5 | Horaires/tarifs invisibles | `src/data/horaires.json` + `src/data/tarifs.json` en source unique, affichés publiquement |
| 6 | URLs `/index.php/` + doublons indexés | Slugs propres et stables en français ; **table de redirections 301** depuis toutes les anciennes URLs (inventaire ci‑dessous) |
| 7 | Pages fantômes (« Boxing ») et page « Landing Page » indexée | Chaque page publiée correspond à une offre réelle ; les landing pages pub ont des slugs parlants (`/essai-gratuit-karate-enfant`) et `noindex` si besoin |
| 8 | Archives tags/catégories indexées | Pas d'archives auto‑générées indexables sans décision explicite |
| 9 | Stack à abonnements (thème + Elementor Pro) et mises à jour perpétuelles | Site statique (Astro) sur hébergement gratuit (Cloudflare Pages) : rien à mettre à jour pour rester en ligne et sécurisé |
| 10 | Localisation incohérente | Coordonnées et quartier définis une seule fois dans `src/data/` et réutilisés partout |

## Inventaire des URLs indexées (pour la table de redirections 301)

```
/                                           → conserver (accueil)
/index.php/classes/                         → /cours/
/index.php/judo/                            → /cours/judo/
/index.php/boxing/                          → supprimer (démo) → 301 vers /cours/
/index.php/personal-training/               → supprimer (démo) → 301 vers /cours/
/index.php/team/                            → /coachs/
/index.php/reviews/                         → /temoignages/ (contenu réel) ou 301 accueil
/index.php/blog/                            → /articles/
/index.php/landing-page/                    → /essai-gratuit/
/index.php/contact/                         → /contact/
/index.php/terms-conditions/                → /conditions/
/index.php/privacy-policy/                  → /confidentialite/
/index.php/category/fitness/                → 301 vers /articles/
/category/fitness/                          → 301 vers /articles/ (doublon)
/index.php/category/healthy-living/         → 301 vers /articles/
/index.php/category/workout-routines/       → 301 vers /articles/
/index.php/tag/routine/                     → 301 vers /articles/
```

*(Cibles proposées — à valider. Un crawl complet au second passage complétera la liste : pages karaté/taekwondo/camp/parascolaire probablement existantes mais non remontées par l'index.)*

## Limites de cet audit

1. **Pas d'accès HTTP direct** au domaine depuis cet environnement (politique réseau) : pas de captures d'écran, pas d'inspection du HTML rendu, pas de mesure PageSpeed. Les constats reposent sur le contenu indexé par Google — fiable pour l'existence et les titres des pages, partiel pour l'exhaustivité.
2. **Pages potentiellement manquantes** à l'inventaire (karaté, taekwondo, camp, parascolaire, tarifs cachés derrière une image, etc.).
3. Pour le second passage : autoriser `centresportifhp.com` (ou l'accès complet) dans la politique réseau de l'environnement — voir la configuration des environnements sur claude.ai/code.
