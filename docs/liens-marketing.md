# Liens marketing : la référence unique

Tous les liens publiés hors du site (bios, fiche Google, QR, SMS, signatures)
vivent ici. Ne jamais improviser un lien ailleurs : on le compose ici, on le
copie, et l'attribution arrive toute seule dans Prospects.

Depuis le 21 août 2026 (PR #7 de GYM-MANAGEMENT fusionnée), chaque lead affiche
sa provenance dans l'app : `source` (quelle page du site) et les UTM (quel
canal, quelle opération, quel emplacement). Vérifié de bout en bout.

## Les trois portes d'entrée

| Page | URL | `source` envoyé |
|---|---|---|
| Accueil (formulaire en bas) | `https://centresportifhp.com/` | `site-accueil` |
| Landing karaté enfants | `https://centresportifhp.com/essai-gratuit-karate-enfant/` | `landing-karate-enfant` |
| Landing Ninjas 4-8 ans | `https://centresportifhp.com/essai-gratuit-ninjas/` | `landing-ninjas-4-8` |

Les landings n'ont ni navigation ni distraction : une seule action possible,
le formulaire. C'est vers elles qu'on envoie le trafic payé ou dirigé.
L'accueil sert au trafic « qui veut se renseigner » (fiche Google, SEO).

## Convention UTM (3 paramètres, toujours les trois)

- `utm_source` : d'où vient le clic (`tiktok`, `instagram`, `facebook`,
  `google`, `qr`, `sms`, `courriel`, `meta`).
- `utm_campaign` : l'opération. `continu` pour les emplacements permanents
  (bios, fiche, signature, affiche vitrine) ; un nom daté pour les opérations
  ponctuelles (`rentree2026`, `reactivation2026`, `retargeting-janv2027`).
- `utm_content` : l'emplacement précis, AUTOSUFFISANT (inclure la plateforme :
  `bio-tiktok`, pas juste `bio`), car l'app affiche la provenance sous la forme
  `source · utm_content` dans les relances.

Règles : minuscules, sans accents, sans espaces (tirets courts). Un lien nu,
sans UTM, fonctionne aussi : `source` est capté quand même. Le SEO ne risque
rien : chaque page déclare son URL canonique sans paramètres.

## Liens prêts à copier

| Emplacement | Lien |
|---|---|
| Bio TikTok | `https://centresportifhp.com/essai-gratuit-ninjas/?utm_source=tiktok&utm_campaign=continu&utm_content=bio-tiktok` |
| Bio Instagram | `https://centresportifhp.com/essai-gratuit-karate-enfant/?utm_source=instagram&utm_campaign=continu&utm_content=bio-instagram` |
| Bouton de la page Facebook (« En savoir plus ») | `https://centresportifhp.com/essai-gratuit-karate-enfant/?utm_source=facebook&utm_campaign=continu&utm_content=bouton-facebook` |
| Fiche Google, champ « Site Web » | `https://centresportifhp.com/?utm_source=google&utm_campaign=continu&utm_content=fiche-google` |
| Fiche Google, lien de rendez-vous | `https://centresportifhp.com/essai-gratuit-karate-enfant/?utm_source=google&utm_campaign=continu&utm_content=rdv-fiche-google` |
| QR code affiche vitrine | `https://centresportifhp.com/essai-gratuit-karate-enfant/?utm_source=qr&utm_campaign=continu&utm_content=affiche-vitrine` |
| QR code flyers rentrée (écoles, parcs) | `https://centresportifhp.com/essai-gratuit-ninjas/?utm_source=qr&utm_campaign=rentree2026&utm_content=flyer-rentree` |
| Signature courriel (centrehp@outlook.com) | `https://centresportifhp.com/essai-gratuit-karate-enfant/?utm_source=courriel&utm_campaign=continu&utm_content=signature` |
| SMS de réactivation (campagne C2) | `https://centresportifhp.com/essai-gratuit-karate-enfant/?utm_source=sms&utm_campaign=reactivation2026&utm_content=sms-relance` |

Même vidéo republiée ailleurs (Reel, Short) : garder le même lien en changeant
seulement `utm_source` (`instagram`, `youtube`).

Pubs Meta : la campagne C1 reste sur les formulaires instantanés (décision du
19 août 2026), donc pas de lien. Si un jour une pub envoie vers le site,
gabarit : `?utm_source=meta&utm_campaign=<nom-campagne>&utm_content=<nom-annonce>`.

## Gabarit pour un nouvel emplacement

```
https://centresportifhp.com/<page>/?utm_source=<canal>&utm_campaign=<operation>&utm_content=<emplacement-precis>
```

Choisir la page selon le public (Ninjas 4-8 vs karaté enfants), ajouter la
ligne dans le tableau ci-dessus, committer. Ne JAMAIS créer de lien vers un
cours qui n'existe pas dans l'offre actuelle (la landing kickboxing femmes a
été retirée pour cette raison).

## Ce que ça donne dans Prospects

Un parent clique le QR de la vitrine et soumet : le lead affiche
`landing-karate-enfant` avec `qr / continu / affiche-vitrine`. La relance
automatique par courriel (si aucun suivi en 3 jours) mentionne
`Provenance : landing-karate-enfant · affiche-vitrine`. À la conversion en
membre, les notes gardent la source et la pub d'origine.
