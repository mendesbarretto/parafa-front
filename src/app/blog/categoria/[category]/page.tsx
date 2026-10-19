import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { BlogCards } from '@/components/BlogCards';
import { blogApi, type BlogPage } from '@/lib/blog';
import { paginatedCanonical } from '@/lib/canonical';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category } = await params;
  const categories = await blogApi<string[]>('/blog/categories');
  if (!categories.includes(category)) notFound();
  return { title: `${category} | Blog Parafa`, alternates: { canonical: paginatedCanonical(`/blog/categoria/${encodeURIComponent(category)}`, (await searchParams).page) } };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const categories = await blogApi<string[]>('/blog/categories');
  if (!categories.includes(category)) notFound();
  const { page: requestedPage } = await searchParams;
  const page = Math.max(1, Number(requestedPage) || 1);
  const posts = await blogApi<BlogPage>(`/blog/posts?category=${encodeURIComponent(category)}&page=${page}&per_page=12`);
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="hero-surface"><div className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/blog" className="text-primary-foreground/80">← Blog</Link>
      <h1 className="mt-4 text-4xl font-extrabold text-primary-foreground">{category}</h1>
    </div></section>
    <div className="mx-auto max-w-6xl px-5 py-12"><BlogCards posts={posts.data} />
      {posts.data.length === 0 && <p>Nenhum artigo nesta categoria.</p>}
      <nav aria-label="Paginação da categoria" className="mt-10 flex gap-6">
        {page > 1 && <Link href={`/blog/categoria/${encodeURIComponent(category)}?page=${page - 1}`} className="text-primary">← Anterior</Link>}
        {page < posts.last_page && <Link href={`/blog/categoria/${encodeURIComponent(category)}?page=${page + 1}`} className="text-primary">Próxima →</Link>}
      </nav>
    </div>
  </main><SiteFooter /></div>;
}
