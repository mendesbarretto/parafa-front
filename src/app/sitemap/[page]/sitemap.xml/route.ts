import { blogApi } from '@/lib/blog';
import { urlSet, xmlResponse } from '@/lib/xml';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!/^\d+$/.test(page)) return new Response(null, { status: 404 });
  try {
    const { pages } = await blogApi<{ pages: number }>('/sitemaps');
    if (Number(page) > pages) return new Response(null, { status: 404 });
    if (Number(page) === pages) return xmlResponse(urlSet([]));
    const { data } = await blogApi<{ data: { url: string | null; updated_at: string | null }[] }>(`/sitemaps/${page}`);
    const urls = data.filter(row => row.url && /^\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/[0-9]+(?:\/[a-z0-9-]+)?$/.test(row.url))
      .map(row => ({ path: row.url!, lastmod: row.updated_at?.slice(0, 10) || undefined }));
    return xmlResponse(urlSet(urls));
  } catch { return new Response('Sitemap indisponível', { status: 503 }); }
}
