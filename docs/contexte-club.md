# Contexte club — extrait du système de gestion (CSHP Gestion)

**Source :** `DOCUMENTATION.md` du dépôt de gestion du club (version 2026-08-12), fournie par Leandro.
**Règle de ce fichier :** uniquement ce qui sert le site public. Aucune donnée de membre, aucune entente privée, aucun identifiant — ces choses vivent dans l'app de gestion, jamais ici.

---

## 1. Identité officielle (source de vérité pour tout le site)

| Champ | Valeur |
|---|---|
| Nom | Centre Sportif de Haute-Performance (CSHP) |
| Adresse | 6498 rue Beaubien Est, Montréal (Québec) H1M 1A9 |
| Téléphone | 514 747-5865 |
| Courriel public | `centrehp@outlook.com` |
| Courriel facturation | `payements@centresportifhp.com` — **jamais affiché sur le site** (canal transactionnel de l'app) |
| Ton | « Chers parents et athlètes », vouvoiement. L'interlocuteur réel est **le parent**. |

À définir une seule fois dans `src/data/club.json` et réutilisé partout (règle n° 10 de l'audit).

## 2. Offre réelle vs site actuel — divergences à trancher avec le propriétaire

Le système de gestion (qui reflète la réalité opérationnelle) et le site actuel ne disent pas la même chose :

| Sujet | Site actuel | Système de gestion | À trancher |
|---|---|---|---|
| Taekwondo | Affiché comme discipline | Absent (disciplines gérées : KARATE, JUDO ; groupes NINJAS) | Le taekwondo est-il encore offert ? |
| Âge du programme NINJAS | « 5 à 8 ans » | « enfants 4-9 ans » | Quelle est la vraie fourchette ? |
| Quartier | « cœur de Saint-Léonard » et « cœur de Montréal » selon la page | Adresse H1M (limite Rosemont / Saint-Léonard / Mercier) | Quel quartier revendiquer (SEO local) ? |
| Kickboxing / fitness / personal training | Mentionnés (démo du thème) | Inexistants | Probablement à supprimer |

Effectifs réels (ordre de grandeur, import 2026) : Karaté ~69, Ninjas ~25, Judo à importer.

## 3. Tarifs officiels — le site actuel n'en montre aucun, les voici

- **TRIMESTRIEL : 250 $** — payable en une seule fois.
- **ANNUEL : 790 $** — versements possibles.
- Prix **taxes incluses** (TPS + TVQ, méthode québécoise).
- **Rabais famille : −10 %** (les rabais s'additionnent, ne se multiplient pas).
- Les forfaits incluent **2 semaines de fermeture l'hiver et 2 l'été**.
- **1ᵉʳ versement exigible à l'inscription.**

→ alimente `src/data/tarifs.json`. Les ententes négociées individuelles existent mais ne concernent pas le site.

## 4. Intégration site ↔ app de gestion (décision d'architecture majeure)

L'app de gestion en production (`https://cshp-backend.onrender.com`, Express + React, auto-déployée depuis `main`) expose déjà **deux points d'entrée publics** :

1. **`POST /api/leads`** (public, rate-limité) — crée un prospect. Le pipeline aval existe déjà : relance automatique de l'admin après 3 jours sans suivi (`LEAD_RELANCE`), conversion outillée, champ `provenance` (`WEB`, `RESEAUX_SOCIAUX`, …).
2. **`/inscription`** (fiche d'inscription en ligne publique) — consentements, anti-doublon, création du membre EN_ATTENTE, courriels de bienvenue/notification déjà branchés.

**Conséquence : le nouveau site n'a besoin d'aucun backend de formulaire.**
- Le CTA principal « essai gratuit » = formulaire statique qui poste vers `POST /api/leads` avec la bonne `provenance` (permet de distinguer les landing pages Meta Ads du trafic organique).
- Le bouton « Inscription » = lien vers la fiche en ligne existante.
- Le site devient la façade du système existant ; le CRM, les relances et les courriels restent dans l'app.

À valider avec le proprio : CORS côté app pour le domaine du site, et la valeur `provenance` à utiliser par landing page.

## 5. Marque

- **Logo :** `LOGO.jpg` (source brute) et `public/logo.png` (optimisé) dans le dépôt de gestion — à copier dans ce dépôt.
- **Couleur de marque : rouge CSHP** — l'app de gestion a un thème Tailwind avec variables `--color-cshp-red…`. La palette exacte est à extraire du logo et du site lors du scrape complet, mais la dominante est établie.
- Ton éditorial : discipline, confiance, haute performance — mais parents d'enfants comme lecteurs.

## 6. ⚠️ Migration DNS — checklist de mise en ligne (à ne pas oublier)

Le domaine `centresportifhp.com` est **vérifié chez Resend** et sert à envoyer tous les courriels transactionnels du club (reçus, rappels de paiement, renouvellements — depuis `payements@centresportifhp.com`).

**Quand le domaine pointera vers le nouveau site (Cloudflare Pages) :**
1. Inventorier les enregistrements DNS actuels AVANT tout changement (TXT SPF, DKIM Resend, éventuels MX, verification records).
2. Les recréer à l'identique dans la nouvelle zone DNS.
3. Vérifier dans le tableau de bord Resend que le domaine reste « verified » après la bascule.
4. Vérifier `APP_URL` côté app de gestion (les courriels y chargent le logo et les liens d'inscription).

Casser ça = les parents ne reçoivent plus reçus ni rappels → paiements manqués. C'est le risque n° 1 de la migration.

## 7. Calendrier métier

- **Saison fédération : 1ᵉʳ septembre → 31 août** (« 2026-2027 »). La rentrée est le rythme naturel du site (inscriptions, horaires, affiliations, compétitions).
- Fermetures : 2 semaines l'hiver, 2 l'été.
- Une fiche d'inscription papier « 2026-2027 » existe déjà dans le dépôt de gestion — la session qui commence est imminente.

## 8. Frontières de données (règles héritées de l'app, valables pour le site)

- Jamais de coût de revient d'équipement, d'entente négociée, de donnée de membre ou de donnée sensible (esprit Loi 25) sur le site ou dans ce dépôt.
- Le site est 100 % statique et public ; tout ce qui est nominatif reste dans l'app de gestion.
