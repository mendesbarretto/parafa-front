import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { blogApi, blogDate, type BlogPost } from '@/lib/blog';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ post: string }> };

async function getPost(slug: string) {
  try { return await blogApi<BlogPost>(`/blog/posts/${encodeURIComponent(slug)}`); }
  catch (error) { if (String(error).includes('API 404:')) notFound(); throw error; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).post);
  return { title: `${post.title} | Parafa Blog`, description: post.meta_description || post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.meta_description || post.excerpt || undefined } };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).post);
  return <div className="min-h-screen bg-background"><SiteHeader /><main><article>
    <section className="hero-surface"><div className="mx-auto max-w-4xl px-5 py-14">
      <Link href="/blog" className="text-primary-foreground/80">← Blog</Link>
      {post.categories?.[0] && <p className="mt-6 text-primary-foreground/80">{post.categories[0]}</p>}
      <h1 className="mt-3 text-4xl font-extrabold text-primary-foreground">{post.title}</h1>
      <p className="mt-5 text-primary-foreground/80">{blogDate(post.published_at)} · Equipe Parafa</p>
    </div></section>
    <div className="mx-auto max-w-4xl px-5 py-12"><div className="prose prose-lg max-w-none whitespace-pre-wrap">{post.content}</div>
      <Link href="/blog" className="mt-12 inline-block text-primary">← Voltar para o blog</Link>
    </div>
  </article></main><SiteFooter /></div>;
}
