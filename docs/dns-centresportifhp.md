# Inventaire DNS de centresportifhp.com (relevé le 20 août 2026)

Relevé via DNS over HTTPS (dns.google). État de référence à conserver.

| Enregistrement | Type | Valeur |
|---|---|---|
| centresportifhp.com | NS | ns1.dns-parking.com, ns2.dns-parking.com (**Hostinger**) |
| centresportifhp.com | A | 84.32.84.186, 88.222.222.193 (Hostinger) |
| www | CNAME | www.centresportifhp.com.cdn.hstgr.net (CDN Hostinger) |
| centresportifhp.com | MX | mx1/mx2.titan.email (courriel **Titan** de Hostinger) |
| centresportifhp.com | TXT | `v=spf1 include:spf.titan.email ~all` |
| centresportifhp.com | TXT | `google-site-verification=MOj7…` (Search Console vérifiée) |
| resend._domainkey | TXT | clé DKIM **Resend** (p=MIGfMA0GCSqGSIb3DQEB…) |
| send | TXT | `v=spf1 include:amazonses.com ~all` (**Resend**, envoi via SES) |
| send | MX | feedback-smtp.us-east-1.amazonses.com (**Resend**) |
| _dmarc | TXT | absent (amélioration possible plus tard, sans urgence) |

## Conséquences

1. **Tout est déjà chez Hostinger** (DNS + hébergement du WordPress). Remplacer
   l'ancien site = remplacer les fichiers de `public_html` dans le même compte.
   **Aucun changement DNS requis. Aucun risque pour les courriels.**
2. Les 3 enregistrements **Resend** (resend._domainkey TXT, send TXT, send MX)
   et les MX **Titan** ne doivent JAMAIS être supprimés de la zone : ce sont eux
   qui portent les reçus/rappels de l'app de gestion et les boîtes du club.
3. La vérification Google (TXT) donne accès à Search Console : y soumettre le
   sitemap après la mise en ligne.
