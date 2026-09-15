import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Parafa",
  description: "Dicas, novidades e informações sobre empresas e serviços.",
  openGraph: {
    title: "Blog | Parafa",
    description: "Dicas, novidades e informações sobre empresas e serviços.",
  },
};

// Mock data para o blog - substituir por dados reais do backend
const blogPosts = [
  {
    id: 1,
    title: "Como escolher o melhor restaurante para seu evento",
    excerpt: "Dicas práticas para selecionar o local perfeito para suas celebrações.",
    category: "Dicas",
    date: "2024-09-10",
    readTime: "5 min",
    slug: "como-escolher-melhor-restaurante-evento",
  },
  {
    id: 2,
    title: "Guia completo de serviços em Curitiba",
    excerpt: "Descubra os melhores profissionais e estabelecimentos da cidade.",
    category: "Guias",
    date: "2024-09-08",
    readTime: "8 min",
    slug: "guia-completo-servicos-curitiba",
  },
  {
    id: 3,
    title: "Dicas para encontrar bons profissionais",
    excerpt: "Aprenda a identificar profissionais qualificados em qualquer área.",
    category: "Dicas",
    date: "2024-09-05",
    readTime: "4 min",
    slug: "dicas-encontrar-bons-profissionais",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-surface">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
              blog
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
              Blog Parafa
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              Dicas, novidades e informações sobre empresas e serviços em todo o Brasil.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                    {post.category}
                  </span>
                </div>

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
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
