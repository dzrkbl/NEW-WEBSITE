# Déploiement sur Cloudflare Pages

Deux phases distinctes. La phase 1 met le site en ligne sur une adresse
`*.pages.dev` sans toucher au domaine ni aux DNS (donc aucun risque pour les
courriels Resend). La phase 2, plus tard, branche le domaine.

## Phase 1 : mise en ligne sur *.pages.dev (10 minutes, aucun risque)

### Option A : depuis le tableau de bord Cloudflare (recommandé)

1. https://dash.cloudflare.com → Workers & Pages → Create → Pages →
   « Connect to Git ».
2. Autoriser GitHub et choisir le dépôt `dzrkbl/NEW-WEBSITE`.
3. Réglages de build :
   - Production branch : `claude/website-maintenance-redesign-x78nl2`
     (ou `main` après fusion)
   - Framework preset : **Astro**
   - Build command : `npm run build`
   - Build output directory : `dist`
   - Variable d'environnement : `NODE_VERSION` = `20`
4. « Save and Deploy ». Deux minutes plus tard le site est servi sur
   `https://<nom-du-projet>.pages.dev` (suggestion de nom : `cshp`).
5. Tester sur téléphone : la page d'accueil, `/essai-gratuit-ninjas/`,
   `/essai-gratuit-karate-enfant/`, `/confidentialite/`, et une soumission
   de formulaire (utiliser prénom TEST puis supprimer le lead dans Prospects).

Chaque nouveau commit sur la branche redéploie automatiquement.

### Option B : me confier le déploiement

Créer un jeton API Cloudflare (My Profile → API Tokens → Create Token →
gabarit « Edit Cloudflare Workers », portée Compte + Pages) et me le donner
avec l'Account ID : je déploie via `wrangler pages deploy dist` et je vous
rends l'URL. Revoquer le jeton ensuite.

## Ce que la phase 1 permet immédiatement

- Lien de bio TikTok / Instagram / fiche Google vers les landings.
- Le formulaire fonctionne (CORS ouvert côté app, contrat validé, testé 201).
- Le fichier `public/_redirects` est déjà en place : il ne sert à rien sur
  `*.pages.dev` (pas d'anciennes URLs là), mais tout est prêt pour la phase 2.

## Phase 2 : brancher centresportifhp.com (plus tard, avec la checklist DNS)

1. **AVANT tout** : exporter l'inventaire DNS complet du domaine
   (SPF, DKIM Resend, MX, TXT de vérification). Voir `contexte-club.md` §6.
2. Cloudflare Pages → Custom domains → ajouter `centresportifhp.com` et `www`.
3. Recréer les enregistrements Resend à l'identique dans la zone DNS.
4. Vérifier dans Resend que le domaine reste « Verified » ; envoyer un reçu
   de test depuis l'app.
5. Les 301 de `public/_redirects` prennent effet pour tout l'ancien trafic.
6. Mettre à jour la cible des pubs Meta et le lien de la fiche Google.
7. L'adresse `*.pages.dev` continue de fonctionner : les liens de bio déjà
   publiés ne cassent pas.
