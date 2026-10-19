import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { BlogCards } from '@/components/BlogCards';
import { blogApi, type BlogPage } from '@/lib/blog';
import { paginatedCanonical } from '@/lib/canonical';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string; busca?: string; categoria?: string }> }): Promise<Metadata> {
  const { page, busca, categoria } = await searchParams;
  return {
    title: 'Blog | Parafa',
    description: 'Artigos e notícias do Parafa.',
    alternates: { canonical: busca || categoria ? '/blog' : paginatedCanonical('/blog', page) },
    ...(busca || categoria ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; busca?: string; categoria?: string }> }) {
  const { page: requestedPage, busca = '', categoria = '' } = await searchParams;
  const page = Math.max(1, Number(requestedPage) || 1);
  const query = new URLSearchParams({ page: String(page), per_page: '12' });
  if (busca) query.set('search', busca);
  if (categoria) query.set('category', categoria);
  const [posts, categories] = await Promise.all([
    blogApi<BlogPage>(`/blog/posts?${query}`),
    blogApi<string[]>('/blog/categories'),
  ]);
  const pageHref = (target: number) => `/blog?${new URLSearchParams({ ...Object.fromEntries(query), page: String(target) })}`;
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="hero-surface"><div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-4xl font-extrabold text-primary-foreground">Blog Parafa</h1>
      <p className="mt-3 text-primary-foreground/80">Artigos e notícias sobre empresas e serviços.</p>
    </div></section>
    <div className="mx-auto max-w-6xl px-5 py-12">
      <form action="/blog" method="get" className="mb-8 flex flex-wrap gap-3">
        <input name="busca" defaultValue={busca} placeholder="Buscar artigos" aria-label="Buscar artigos" className="rounded-lg border border-border bg-card px-4 py-2" />
        <select name="categoria" defaultValue={categoria} aria-label="Categoria" className="rounded-lg border border-border bg-card px-4 py-2">
          <option value="">Todas as categorias</option>
          {categories.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Buscar</button>
      </form>
      <BlogCards posts={posts.data} />
      {posts.data.length === 0 && <p>Nenhum artigo publicado.</p>}
      <nav aria-label="Paginação do blog" className="mt-10 flex gap-6">
        {page > 1 && <Link href={pageHref(page - 1)} className="text-primary">← Anterior</Link>}
        {page < posts.last_page && <Link href={pageHref(page + 1)} className="text-primary">Próxima →</Link>}
      </nav>
    </div>
  </main><SiteFooter /></div>;
}
