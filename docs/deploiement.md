# Déploiement — Hostinger (hébergement du club)

État des lieux (voir `dns-centresportifhp.md`) : le domaine, son DNS et l'ancien
WordPress sont déjà chez Hostinger. Écraser l'ancien site = remplacer les fichiers
de `public_html` dans le même compte. **Aucun changement DNS. Aucun risque pour
les courriels Titan/Resend.**

## Mise en ligne initiale (écrasement de l'ancien site), ~20 minutes

1. **Sauvegarde d'abord.** hPanel → Sites Web → centresportifhp.com →
   Sauvegardes → générer et TÉLÉCHARGER une sauvegarde complète (fichiers + base
   de données). C'est le filet de sécurité ; les photos sont déjà archivées dans
   `archives/photos-site-2026/` de ce dépôt.
2. hPanel → Gestionnaire de fichiers → `public_html` → tout sélectionner →
   supprimer. (Le WordPress, ses plugins et sa dette disparaissent ici.)
3. Téléverser `cshp-site.zip` (produit par `npm run build`, contenu du dossier
   `dist/`) à la racine de `public_html` → clic droit → Extraire → supprimer le zip.
   Vérifier que `.htaccess` est bien présent à la racine (fichiers cachés visibles
   dans le Gestionnaire : engrenage → « Afficher les fichiers cachés »).
4. Si le hPanel propose un cache (LiteSpeed/CDN) : le vider.
5. Tests depuis un téléphone :
   - `https://centresportifhp.com/` (accueil, photos, horaire)
   - `/essai-gratuit-karate-enfant/` et `/essai-gratuit-ninjas/`
   - `/confidentialite/` et une URL inexistante (page 404)
   - anciennes URLs : `/horaire/` doit rediriger vers `/#horaire`,
     `/shop/` vers l'accueil, `/index.php/team/` vers l'accueil
   - une soumission de formulaire (prénom TEST, puis supprimer le lead dans
     Prospects)
6. Ne PAS toucher à la zone DNS : les MX Titan et les 3 enregistrements Resend
   doivent rester tels quels.

## Déploiements suivants : automatiques à chaque push

Le workflow `.github/workflows/deploiement-hostinger.yml` construit le site et le
téléverse par FTPS à chaque push. À configurer une seule fois :

1. hPanel → Fichiers → Comptes FTP : noter l'hôte, l'utilisateur, le mot de passe
   (ou créer un compte FTP dédié pointant sur `public_html`).
2. GitHub → dépôt NEW-WEBSITE → Settings → Secrets and variables → Actions →
   New repository secret, trois fois :
   - `HOSTINGER_FTP_SERVER`
   - `HOSTINGER_FTP_USERNAME`
   - `HOSTINGER_FTP_PASSWORD`
3. C'est tout. Chaque push met le site à jour (2 à 3 minutes). Sans les secrets,
   le workflow vérifie seulement que le build passe.

## Après la mise en ligne

1. Search Console (déjà vérifiée par TXT) : soumettre `https://centresportifhp.com/sitemap-index.xml`
   quand le sitemap sera généré, et demander la réindexation de l'accueil.
2. Mettre à jour le lien de la fiche Google Business et la cible des pubs Meta.
3. Surveiller la première semaine : leads dans Prospects, 404 dans Search Console.

## Annexe : Cloudflare Pages (solution de repli, non utilisée)

Le site reste 100 % compatible : brancher le dépôt sur Cloudflare Pages
(build `npm run build`, sortie `dist`, `NODE_VERSION=20`) et utiliser
`docs/redirections-cloudflare-pages.txt` comme `public/_redirects` à la place
du `.htaccess`.
