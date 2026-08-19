import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://centresportifhp.com',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
});
