import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';
import { blogDate } from '@/lib/blog';

export function BlogCards({ posts }: { posts: BlogPost[] }) {
  return <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {posts.map(post => <article key={post.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
      {post.categories?.[0] && <Link href={`/blog/categoria/${encodeURIComponent(post.categories[0])}`} className="mb-4 text-sm font-semibold text-primary">{post.categories[0]}</Link>}
      <h2 className="text-xl font-bold"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
      <p className="mt-3 line-clamp-3 text-muted-foreground">{post.excerpt}</p>
      <p className="mt-4 text-sm text-muted-foreground">{blogDate(post.published_at)}</p>
      <Link href={`/blog/${post.slug}`} className="mt-6 text-sm font-semibold text-primary">Ler mais →</Link>
    </article>)}
  </div>;
}
