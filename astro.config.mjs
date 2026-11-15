import { defineConfig } from 'astro/config';

// IMPORTANTE: troque pelo endereço real do seu site (sem barra no final).
// Ele é usado em URLs canônicas, sitemap, Open Graph e dados estruturados.
const SITE_URL = 'https://www.seudominio.com.br';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
});
