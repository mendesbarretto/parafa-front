import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { EmpresaCard } from "@/components/EmpresaCard";
import { CompanyPagination } from "@/components/CompanyPagination";
import { fetchEmpresas, fetchDepartamento } from "@/lib/api";
import { requiredData } from "@/lib/page-data";
import { requireCityFromPath } from "@/lib/city-page";
import { paginatedCanonical } from "@/lib/canonical";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
    departamento: string;
    categoria: string;
  }>;
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug, departamento, categoria } = await params;
    const parts = slug.split('-');
    const uf = parts[parts.length - 1].toUpperCase();
    const cidade = parts.slice(0, -1).join('-');
    const categoriaFormatada = categoria.replace(/-/g, ' ');
    const [, departamentoEncontrado] = await Promise.all([
      requireCityFromPath(slug),
      requiredData(fetchDepartamento(departamento)),
    ]);
    if (!departamentoEncontrado.categories?.some((entry) => entry.url === categoria)) notFound();
    
    return {
      alternates: { canonical: paginatedCanonical(`/${slug}/${departamento}/${categoria}`, (await searchParams).page) },
      title: `${categoriaFormatada} em ${cidade}/${uf} | Parafa`,
      description: `Encontre empresas de ${categoriaFormatada} em ${cidade}, ${uf}: telefone e endereço.`,
      openGraph: {
        title: `${categoriaFormatada} em ${cidade}/${uf} | Parafa`,
        description: `Busque empresas de ${categoriaFormatada} em ${cidade} com telefone e endereço.`,
      },
    };
}

export default async function SlugDepartamentoCategoriaPage({ params, searchParams }: PageProps) {
    const { slug, departamento, categoria } = await params;
    const requestedPage = Number.parseInt((await searchParams).page || '1', 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const parts = slug.split('-');
    const uf = parts[parts.length - 1].toUpperCase();
    const cidade = parts.slice(0, -1).join('-');
    const city = await requireCityFromPath(slug);
    
    // Buscar categoria pelo slug
    const departamentoEncontrado = await requiredData(fetchDepartamento(departamento));
    const categoriaEncontrada = departamentoEncontrado.categories?.find(c => c.url === categoria);
    if (!categoriaEncontrada) notFound();
    
    // Buscar empresas desta cidade e categoria
    const empresasData = await fetchEmpresas({
      category_id: categoriaEncontrada.id,
      city_id: city.id,
      include_inactive: true,
      per_page: 20,
      page,
    });
    const empresasFiltradas = empresasData.data;

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
                <Link href={`/${slug}`} prefetch={false} className="transition-colors hover:text-primary-foreground">
                  {cidade}/{uf}
                </Link>
                <ArrowRight className="size-3.5" />
                <Link href={`/${slug}/${departamento}`} prefetch={false} className="transition-colors hover:text-primary-foreground">
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
                  {empresasData.meta.total} empresas cadastradas
                </p>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {empresasFiltradas.map((empresa) => (
                <EmpresaCard key={empresa.id} empresa={empresa} />
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

            <CompanyPagination basePath={`/${slug}/${departamento}/${categoria}`} page={page} lastPage={empresasData.meta.last_page} />

            <div className="mt-14">
              <AdSlot format="leaderboard" />
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    );
}
