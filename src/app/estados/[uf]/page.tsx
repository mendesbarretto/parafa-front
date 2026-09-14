import Link from "next/link";
import { MapPin, Star, BadgeCheck, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchEmpresas } from "@/lib/api";
import { EmpresaCard } from "@/components/EmpresaCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    uf: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

interface PageProps {
  params: Promise<{
    uf: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalida a cada 5 minutos

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { uf } = await params;
    const ufUpper = uf.toUpperCase();
    
    // Mapeamento de UF para nome do estado
    const estadoNomes: Record<string, string> = {
      'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
      'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
      'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
      'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PE': 'Pernambuco',
      'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
      'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
      'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
    };
    
    const estadoNome = estadoNomes[ufUpper];
    
    if (!estadoNome) {
      return {
        title: "Estado não encontrado | Parafa",
        robots: {
          index: false,
        },
      };
    }

    return {
      title: `Empresas em ${estadoNome} | Parafa`,
      description: `Encontre empresas cadastradas em ${estadoNome}: telefone, endereço, horários e avaliações.`,
      openGraph: {
        title: `Empresas em ${estadoNome} | Parafa`,
        description: `Busque empresas em ${estadoNome} com telefone, endereço e avaliações.`,
      },
    };
  } catch {
    return {
      title: "Erro ao carregar estado | Parafa",
    };
  }
}

export default async function EstadoDetalhePage({ params, searchParams }: PageProps) {
  try {
    const { uf } = await params;
    const { page = '1' } = await searchParams;
    const ufUpper = uf.toUpperCase();
    const currentPage = parseInt(page, 10);
    
    // Mapeamento de UF para nome do estado
    const estadoNomes: Record<string, string> = {
      'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
      'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
      'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
      'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PE': 'Pernambuco',
      'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
      'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
      'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
    };
    
    const estadoNome = estadoNomes[ufUpper];
    
    if (!estadoNome) {
      notFound();
    }

    const empresasData = await fetchEmpresas({ state: ufUpper, per_page: 20, page: currentPage });

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
                <Link href="/estados" className="transition-colors hover:text-primary-foreground">
                  Estados
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="font-medium text-primary-foreground">{estadoNome}</span>
              </nav>

              <div className="mt-6 flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-secondary text-sm font-extrabold text-primary">
                  {ufUpper}
                </span>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                    Empresas em {estadoNome}
                  </h1>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    {empresasData.meta.total} empresas cadastradas
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {empresasData.data.map((empresa) => (
                <EmpresaCard key={empresa.id} empresa={empresa} />
              ))}
            </div>

            {empresasData.data.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="mt-3 font-medium text-foreground">Nenhuma empresa encontrada neste estado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente outro estado ou volte mais tarde.
                </p>
              </div>
            )}

            {empresasData.meta.last_page > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {empresasData.meta.current_page > 1 && (
                  <Link
                    href={`/estados/${uf}?page=${empresasData.meta.current_page - 1}`}
                    className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <ChevronLeft className="size-4" />
                    Anterior
                  </Link>
                )}
                
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Página {empresasData.meta.current_page} de {empresasData.meta.last_page}
                </span>
                
                {empresasData.meta.current_page < empresasData.meta.last_page && (
                  <Link
                    href={`/estados/${uf}?page=${empresasData.meta.current_page + 1}`}
                    className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Próxima
                    <ChevronRight className="size-4" />
                  </Link>
                )}
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
          <p className="text-center text-red-500">Erro ao carregar dados do estado.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
