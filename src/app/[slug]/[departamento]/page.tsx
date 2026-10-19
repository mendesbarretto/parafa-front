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
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
    departamento: string;
  }>;
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug, departamento } = await params;
    const parts = slug.split('-');
    const uf = parts[parts.length - 1].toUpperCase();
    const cidade = parts.slice(0, -1).join('-');
    const departamentoFormatado = departamento.replace(/-/g, ' ');
    await Promise.all([requireCityFromPath(slug), requiredData(fetchDepartamento(departamento))]);
    
    return {
      alternates: { canonical: paginatedCanonical(`/${slug}/${departamento}`, (await searchParams).page) },
      title: `${departamentoFormatado} em ${cidade}/${uf} | Parafa`,
      description: `Encontre empresas de ${departamentoFormatado} em ${cidade}, ${uf}: telefone e endereço.`,
      openGraph: {
        title: `${departamentoFormatado} em ${cidade}/${uf} | Parafa`,
        description: `Busque empresas de ${departamentoFormatado} em ${cidade} com telefone e endereço.`,
      },
    };
}

export default async function SlugDepartamentoPage({ params, searchParams }: PageProps) {
    const { slug, departamento } = await params;
    const requestedPage = Number.parseInt((await searchParams).page || '1', 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const parts = slug.split('-');
    const uf = parts[parts.length - 1].toUpperCase();
    const cidade = parts.slice(0, -1).join('-');
    const city = await requireCityFromPath(slug);
    
    const [departamentoEncontrado, empresasData] = await Promise.all([
      requiredData(fetchDepartamento(departamento)),
      fetchEmpresas({
        city_id: city.id,
        department_url: departamento,
        include_inactive: true,
        per_page: 20,
        page,
      }),
    ]);
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
                <span className="font-medium text-primary-foreground">{departamentoEncontrado.name}</span>
              </nav>

              <div className="mt-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                  {departamentoEncontrado.name} em {cidade}
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
                <p className="mt-3 font-medium text-foreground">Nenhuma empresa encontrada neste departamento</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente outro departamento ou volte mais tarde.
                </p>
              </div>
            )}

            <CompanyPagination basePath={`/${slug}/${departamento}`} page={page} lastPage={empresasData.meta.last_page} />

            <div className="mt-14">
              <AdSlot format="leaderboard" />
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    );
}
