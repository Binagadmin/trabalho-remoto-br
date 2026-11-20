import type { APIRoute } from 'astro';
import { site } from '../config';

export const GET: APIRoute = () => {
  const txt = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /buscar/',
    'Disallow: /admin/',
    '',
    '# O robô do AdSense precisa poder ler todas as páginas.',
    'User-agent: Mediapartners-Google',
    'Allow: /',
    '',
    `Sitemap: ${site.url}/sitemap.xml`,
    '',
  ].join('\n');
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
