import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    post: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { post } = await params;
    // Mock data - substituir por dados reais do backend
    const blogPost = {
      title: "Como escolher o melhor restaurante para seu evento",
      excerpt: "Dicas práticas para selecionar o local perfeito para suas celebrações.",
    };
    
    return {
      title: `${blogPost.title} | Parafa Blog`,
      description: blogPost.excerpt,
      openGraph: {
        title: `${blogPost.title} | Parafa Blog`,
        description: blogPost.excerpt,
      },
    };
  } catch {
    return {
      title: "Blog | Parafa",
    };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  try {
    const { post } = await params;
    
    // Mock data - substituir por dados reais do backend
    const blogPost = {
      title: "Como escolher o melhor restaurante para seu evento",
      content: `
        <p>Escolher o restaurante perfeito para seu evento é uma tarefa que requer planejamento e atenção aos detalhes. Aqui estão algumas dicas importantes:</p>
        
        <h2>1. Capacidade e Espaço</h2>
        <p>Verifique se o restaurante comporta todos os convidados confortavelmente. Considere o espaço para circulação, área de dança (se aplicável) e outras atividades planejadas.</p>
        
        <h2>2. Localização e Acessibilidade</h2>
        <p>Pense na facilidade de acesso para seus convidados. Estacionamento, transporte público e proximidade de outras atrações são fatores importantes.</p>
        
        <h2>3. Cardápio e Restrições Alimentares</h2>
        <p>Analise o menu disponível e verifique se há opções para vegetarianos, veganos, alérgicos e outras restrições alimentares.</p>
        
        <h2>4. Orçamento e Pacotes</h2>
        <p>Compare os preços e os serviços incluídos em cada pacote. À vezes, aparentemente mais caro pode incluir mais benefícios.</p>
        
        <h2>5. Reputação e Avaliações</h2>
        <p>Pesquise avaliações de outros clientes e visite o restaurante antes de fechar contrato, se possível.</p>
        
        <p>Seguindo estas dicas, você aumentará significativamente as chances de fazer a escolha certa para seu evento!</p>
      `,
      category: "Dicas",
      date: "2024-09-10",
      readTime: "5 min",
      author: "Equipe Parafa",
    };

    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <main>
          <article>
            <section className="hero-surface">
              <div className="mx-auto max-w-4xl px-5 py-14 md:py-16">
                <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/70">
                  <Link href="/" className="transition-colors hover:text-primary-foreground">
                    Início
                  </Link>
                  <ArrowLeft className="size-3.5" />
                  <Link href="/blog" className="transition-colors hover:text-primary-foreground">
                    Blog
                  </Link>
                </nav>

                <div className="mt-6">
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                    {blogPost.category}
                  </span>
                  <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
                    {blogPost.title}
                  </h1>
                </div>

                <div className="mt-6 flex items-center gap-6 text-sm text-primary-foreground/80">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {new Date(blogPost.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {blogPost.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Por {blogPost.author}</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="mx-auto max-w-4xl px-5 py-12">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
              </div>

              <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="size-3.5" />
                  Voltar para o blog
                </Link>
                <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  <Share2 className="size-3.5" />
                  Compartilhar
                </button>
              </div>
            </div>
          </article>
        </main>

        <SiteFooter />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-5 py-12">
          <p className="text-center text-red-500">Erro ao carregar artigo do blog.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
