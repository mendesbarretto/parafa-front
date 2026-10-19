import { blogApi, type BlogPage } from '@/lib/blog';
import { SITE_URL, xmlEscape } from '@/lib/xml';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await blogApi<BlogPage>('/blog/posts?per_page=50');
    const items = posts.data.map(post => `<item><title>${xmlEscape(post.title)}</title><description>${xmlEscape(post.excerpt || '')}</description><link>${SITE_URL}/blog/${encodeURIComponent(post.slug)}</link><guid isPermaLink="true">${SITE_URL}/blog/${encodeURIComponent(post.slug)}</guid><pubDate>${new Date(post.published_at).toUTCString()}</pubDate></item>`).join('');
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Parafa Blog</title><link>${SITE_URL}/blog</link><description>Artigos e notícias do Parafa</description><language>pt-br</language>${items}</channel></rss>`, {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
    });
  } catch { return new Response('Blog indisponível', { status: 503 }); }
}
