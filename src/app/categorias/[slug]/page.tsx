import Link from "next/link";
import { MapPin, Star, BadgeCheck, ArrowRight, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchEmpresas, fetchCategorias } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const categoriasData = await fetchCategorias();
    const categoria = categoriasData.data.find(c => c.url === slug);
    
    if (!categoria) {
      return {
        title: "Categoria não encontrada | Parafa",
        robots: {
          index: false,
        },
      };
    }

    return {
      title: `${categoria.name} | Parafa`,
      description: `Empresas de ${categoria.name} cadastradas no Parafa: telefone, endereço, horários e avaliações.`,
      openGraph: {
        title: `${categoria.name} | Parafa`,
        description: `Encontre ${categoria.name} perto de você com telefone, endereço e avaliações.`,
      },
    };
  } catch {
    return {
      title: "Erro ao carregar categoria | Parafa",
    };
  }
}

export default async function CategoriaDetalhePage({ params }: PageProps) {
  try {
    const { slug } = await params;
    const categoriasData = await fetchCategorias();
    const categoria = categoriasData.data.find(c => c.url === slug);
    
    if (!categoria) {
      notFound();
    }

    const empresasData = await fetchEmpresas({ category_id: categoria.id, per_page: 20 });

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
                <ChevronRight className="size-3.5" />
                <Link href="/categorias" className="transition-colors hover:text-primary-foreground">
                  Categorias
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="font-medium text-primary-foreground">{categoria.name}</span>
              </nav>

              <div className="mt-6 flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                  <span className="text-xl font-bold">{categoria.name.charAt(0)}</span>
                </span>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                    {categoria.name}
                  </h1>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    {categoria.customers_count} empresas cadastradas
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {empresasData.data.map((empresa) => (
                <article
                  key={empresa.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                      Categoria
                    </span>
                  </div>

                  <h2 className="mt-4 flex items-start gap-1.5 text-base font-semibold leading-snug text-card-foreground">
                    {empresa.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{empresa.description || 'Sem descrição'}</p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-4" /> {empresa.neighborhood} — {empresa.city}/{empresa.state}
                    </span>
                    <Link
                      href={`/empresas/${empresa.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
                    >
                      Ver <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {empresasData.data.length === 0 && (
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
