import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { category } = await params;
    const categoryFormatted = category.replace(/-/g, ' ');
    
    return {
      title: `Blog: ${categoryFormatted} | Parafa`,
      description: `Artigos sobre ${categoryFormatted} no blog Parafa.`,
      openGraph: {
        title: `Blog: ${categoryFormatted} | Parafa`,
        description: `Artigos sobre ${categoryFormatted} no blog Parafa.`,
      },
    };
  } catch {
    return {
      title: "Blog | Parafa",
    };
  }
}

export default async function BlogCategoryPage({ params }: PageProps) {
  try {
    const { category } = await params;
    const categoryFormatted = category.replace(/-/g, ' ');
    
    // Mock data - substituir por dados reais do backend
    const categoryPosts = [
      {
        id: 1,
        title: `Artigo sobre ${categoryFormatted}`,
        excerpt: `Conteúdo relacionado a ${categoryFormatted}.`,
        date: "2024-09-10",
        readTime: "5 min",
        slug: `artigo-${category}`,
      },
    ];

    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <main>
          <section className="hero-surface">
            <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
              <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/70">
                <Link href="/" className="transition-colors hover:text-primary-foreground">
                  Início
                </Link>
                <ArrowRight className="size-3.5" />
                <Link href="/blog" className="transition-colors hover:text-primary-foreground">
                  Blog
                </Link>
                <ArrowRight className="size-3.5" />
                <span className="font-medium text-primary-foreground">{categoryFormatted}</span>
              </nav>

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                {categoryFormatted}
              </h1>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categoryPosts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
                >
                  <h2 className="text-xl font-bold leading-snug text-card-foreground">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-3 line-clamp-3 text-muted-foreground">{post.excerpt}</p>

                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {post.readTime}
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Ler mais <ArrowRight className="size-3.5" />
                  </Link>
                </article>
              ))}
            </div>

            {categoryPosts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="font-medium text-foreground">Nenhum artigo encontrado nesta categoria</p>
              </div>
            )}
          </div>
        </main>

        <SiteFooter />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-center text-red-500">Erro ao carregar categoria do blog.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
