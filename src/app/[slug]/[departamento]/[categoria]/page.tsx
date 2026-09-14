import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchEmpresas, fetchCategorias } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
    departamento: string;
    categoria: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug, departamento, categoria } = await params;
    const parts = slug.split('-');
    const uf = parts[parts.length - 1].toUpperCase();
    const cidade = parts.slice(0, -1).join('-');
    const categoriaFormatada = categoria.replace(/-/g, ' ');
    
    return {
      title: `${categoriaFormatada} em ${cidade}/${uf} | Parafa`,
      description: `Encontre empresas de ${categoriaFormatada} em ${cidade}, ${uf}: telefone, endereço, horários e avaliações.`,
      openGraph: {
        title: `${categoriaFormatada} em ${cidade}/${uf} | Parafa`,
        description: `Busque empresas de ${categoriaFormatada} em ${cidade} com telefone, endereço e avaliações.`,
      },
    };
  } catch {
    return {
      title: "Erro ao carregar categoria | Parafa",
    };
  }
}

export default async function SlugDepartamentoCategoriaPage({ params }: PageProps) {
  try {
    const { slug, departamento, categoria } = await params;
    const parts = slug.split('-');
    const uf = parts[parts.length - 1].toUpperCase();
    const cidade = parts.slice(0, -1).join('-');
    
    // Buscar categoria pelo slug
    const categoriasData = await fetchCategorias();
    const categoriaEncontrada = categoriasData.data.find(c => c.url === categoria);
    
    if (!categoriaEncontrada) {
      notFound();
    }
    
    // Buscar empresas desta cidade e categoria
    const empresasData = await fetchEmpresas({ category_id: categoriaEncontrada.id, per_page: 50 });
    const empresasFiltradas = empresasData.data.filter(e => 
      e.city.toLowerCase() === cidade.toLowerCase() && 
      e.state.toUpperCase() === uf.toUpperCase()
    );

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
                <Link href={`/${slug}`} className="transition-colors hover:text-primary-foreground">
                  {cidade}/{uf}
                </Link>
                <ArrowRight className="size-3.5" />
                <Link href={`/${slug}/${departamento}`} className="transition-colors hover:text-primary-foreground">
                  {departamento.replace(/-/g, ' ')}
                </Link>
                <ArrowRight className="size-3.5" />
                <span className="font-medium text-primary-foreground">{categoria.replace(/-/g, ' ')}</span>
              </nav>

              <div className="mt-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                  {categoria.replace(/-/g, ' ')} em {cidade}
                </h1>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  {empresasFiltradas.length} empresas cadastradas
                </p>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {empresasFiltradas.map((empresa) => (
                <article
                  key={empresa.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                      {empresa.category_name || "Categoria"}
                    </span>
                  </div>

                  <h2 className="mt-4 flex items-start gap-1.5 text-base font-semibold leading-snug text-card-foreground">
                    {empresa.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{empresa.description || 'Sem descrição'}</p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="grid size-4 place-items-center text-xs">📍</span> {empresa.neighborhood}
                    </span>
                    <Link
                      href={empresa.url}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
                    >
                      Ver <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {empresasFiltradas.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="mt-3 font-medium text-foreground">Nenhuma empresa encontrada nesta categoria</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente outra categoria ou volte mais tarde.
                </p>
              </div>
            )}

            <div className="mt-14">
              <AdSlot format="leaderboard" />
            </div>
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
          <p className="text-center text-red-500">Erro ao carregar dados da categoria.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
