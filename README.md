# Site du CSHP — centresportifhp.com

Site vitrine statique du Centre Sportif de Haute-Performance (école de karaté,
judo et Ninjas U8 à Rosemont, Montréal). Astro 5, CSS vanille, aucune base de
données. Les règles du projet vivent dans `CLAUDE.md` ; le contexte complet de
reprise (historique, décisions, débogage) dans `docs/passation.md`.

## Commandes

```bash
npm install      # une fois
npm run dev      # développement local
npm run build    # build de production (obligatoire avant commit)
```

## Déploiement

Automatique : chaque push sur la branche principale construit le site et le
téléverse chez Hostinger par FTPS (`.github/workflows/deploiement-hostinger.yml`).
La version en ligne est vérifiable sur `/version.txt`.
Procédure complète et secrets requis : `docs/deploiement.md`.

## Sources uniques

Tout chiffre public vit dans `src/data/` : `tarifs.json`, `horaires.json`,
`club.json`, `marketing.json` (ID du pixel Meta). Ne jamais écrire un prix,
un horaire ou une coordonnée en dur dans un composant.
