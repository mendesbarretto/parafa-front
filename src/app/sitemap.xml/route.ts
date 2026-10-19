import { blogApi } from '@/lib/blog';
import { SITE_URL, xmlEscape, xmlResponse } from '@/lib/xml';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { pages } = await blogApi<{ pages: number }>('/sitemaps');
    // O índice antigo incluía também o último shard vazio (0..ceil(total/25000)).
    const urls = ['/sitemaps/pages.xml', ...Array.from({ length: pages + 1 }, (_, i) => `/sitemap/${i}/sitemap.xml`)];
    return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<sitemap><loc>${xmlEscape(SITE_URL + path)}</loc></sitemap>`).join('')}</sitemapindex>`);
  } catch { return new Response('Sitemap indisponível', { status: 503 }); }
}
