export const SITE_URL = 'https://parafa.com.br';
export const xmlEscape = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[character] || character));

export function urlSet(paths: { path: string; lastmod?: string }[]) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map(({ path, lastmod }) => `<url><loc>${xmlEscape(SITE_URL + path)}</loc>${lastmod ? `<lastmod>${xmlEscape(lastmod)}</lastmod>` : ''}</url>`).join('\n') +
    '\n</urlset>';
}

export const xmlResponse = (xml: string) => new Response(xml, {
  headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
});
