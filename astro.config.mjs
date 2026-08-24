import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://centresportifhp.com',
  integrations: [
    // Les landing pages publicitaires sont en noindex : elles n'ont rien à
    // faire dans le plan de site. Seules les pages organiques y figurent.
    sitemap({ filter: (page) => !page.includes('/essai-gratuit-') }),
  ],
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
});
