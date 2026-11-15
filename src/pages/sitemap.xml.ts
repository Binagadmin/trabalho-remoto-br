import type { APIRoute } from 'astro';
import { site, VAGAS_POR_PAGINA } from '../config';
import { AREAS, diaISO, todasAsDicas, vagasAtivas } from '../lib/vagas';

export const GET: APIRoute = async () => {
  const vagas = await vagasAtivas();
  const dicas = await todasAsDicas();
  const hoje = diaISO(new Date());

  const urls: { loc: string; lastmod?: string }[] = [
    { loc: '/', lastmod: hoje },
    { loc: '/vagas/', lastmod: hoje },
    { loc: '/dicas/' },
    { loc: '/sobre/' },
    { loc: '/contato/' },
    { loc: '/politica-de-privacidade/' },
    { loc: '/termos-de-uso/' },
    { loc: '/politica-de-cookies/' },
  ];

  const paginas = Math.ceil(vagas.length / VAGAS_POR_PAGINA);
  for (let n = 2; n <= paginas; n++) urls.push({ loc: `/vagas/${n}/`, lastmod: hoje });

  // Só áreas que têm vagas abertas (as vazias ficam como noindex).
  for (const a of AREAS) {
    if (vagas.some((v) => v.data.area === a.nome)) urls.push({ loc: `/area/${a.slug}/`, lastmod: hoje });
  }
  for (const v of vagas) urls.push({ loc: `/vaga/${v.id}/`, lastmod: diaISO(v.data.data_publicacao) });
  for (const d of dicas) {
    urls.push({ loc: `/dicas/${d.id}/`, lastmod: diaISO(d.data.data_atualizacao ?? d.data.data_publicacao) });
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url><loc>${site.url}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
      )
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
