import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { EmpresaCard } from "@/components/EmpresaCard";
import { fetchEmpresas } from "@/lib/api";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
    departamento: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug, departamento } = await params;
    const parts = slug.split('-');
    const uf = parts[parts.length - 1].toUpperCase();
    const cidade = parts.slice(0, -1).join('-');
    const departamentoFormatado = departamento.replace(/-/g, ' ');
    
    return {
      title: `${departamentoFormatado} em ${cidade}/${uf} | Parafa`,
      description: `Encontre empresas de ${departamentoFormatado} em ${cidade}, ${uf}: telefone, endereço, horários e avaliações.`,
      openGraph: {
        title: `${departamentoFormatado} em ${cidade}/${uf} | Parafa`,
        description: `Busque empresas de ${departamentoFormatado} em ${cidade} com telefone, endereço e avaliações.`,
      },
    };
  } catch {
    return {
      title: "Erro ao carregar departamento | Parafa",
    };
  }
}

export default async function SlugDepartamentoPage({ params }: PageProps) {
  try {
    const { slug, departamento } = await params;
    const parts = slug.split('-');
    const uf = parts[parts.length - 1].toUpperCase();
    const cidade = parts.slice(0, -1).join('-');
    
    // Buscar empresas desta cidade e departamento
    const empresasData = await fetchEmpresas({
      city_url: cidade,
      state: uf,
      department_url: departamento,
      include_inactive: true,
      per_page: 50,
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
                <Link href={`/${slug}`} className="transition-colors hover:text-primary-foreground">
                  {cidade}/{uf}
                </Link>
                <ArrowRight className="size-3.5" />
                <span className="font-medium text-primary-foreground">{departamento.replace(/-/g, ' ')}</span>
              </nav>

              <div className="mt-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                  {departamento.replace(/-/g, ' ')} em {cidade}
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
          <p className="text-center text-red-500">Erro ao carregar dados do departamento.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
