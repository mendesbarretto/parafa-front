import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { EmpresaCard } from "@/components/EmpresaCard";
import { fetchEmpresas, fetchCidades, fetchEstados } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Mapeamento de nomes de estados para UFs
const estadoNomeParaUF: Record<string, string> = {
  "acre": "AC",
  "alagoas": "AL",
  "amapa": "AP",
  "amazonas": "AM",
  "bahia": "BA",
  "ceara": "CE",
  "distrito-federal": "DF",
  "espirito-santo": "ES",
  "goias": "GO",
  "maranhao": "MA",
  "mato-grosso": "MT",
  "mato-grosso-do-sul": "MS",
  "minas-gerais": "MG",
  "para": "PA",
  "paraiba": "PB",
  "pernambuco": "PE",
  "piaui": "PI",
  "rio-de-janeiro": "RJ",
  "rio-grande-do-norte": "RN",
  "rio-grande-do-sul": "RS",
  "rondonia": "RO",
  "roraima": "RR",
  "santa-catarina": "SC",
  "sao-paulo": "SP",
  "sergipe": "SE",
  "tocantins": "TO",
};

const ufParaNome: Record<string, string> = {
  "AC": "Acre",
  "AL": "Alagoas",
  "AP": "Amapá",
  "AM": "Amazonas",
  "BA": "Bahia",
  "CE": "Ceará",
  "DF": "Distrito Federal",
  "ES": "Espírito Santo",
  "GO": "Goiás",
  "MA": "Maranhão",
  "MT": "Mato Grosso",
  "MS": "Mato Grosso do Sul",
  "MG": "Minas Gerais",
  "PA": "Pará",
  "PB": "Paraíba",
  "PE": "Pernambuco",
  "PI": "Piauí",
  "RJ": "Rio de Janeiro",
  "RN": "Rio Grande do Norte",
  "RS": "Rio Grande do Sul",
  "RO": "Rondônia",
  "RR": "Roraima",
  "SC": "Santa Catarina",
  "SP": "São Paulo",
  "SE": "Sergipe",
  "TO": "Tocantins",
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const slugLower = slug.toLowerCase();
    
    // Verifica se é um estado pelo nome
    const uf = estadoNomeParaUF[slugLower];
    if (uf) {
      const estadoNomeFormatado = ufParaNome[uf];
      return {
        title: `Empresas em ${estadoNomeFormatado} | Parafa`,
        description: `Encontre empresas cadastradas em ${estadoNomeFormatado}: telefone, endereço, horários e avaliações.`,
        openGraph: {
          title: `Empresas em ${estadoNomeFormatado} | Parafa`,
          description: `Busque empresas em ${estadoNomeFormatado} com telefone, endereço e avaliações.`,
        },
      };
    }
    
    // Verifica se é uma cidade pelo formato cidade-uf
    const parts = slug.split('-');
    if (parts.length >= 2) {
      const uf = parts[parts.length - 1].toUpperCase();
      const cidade = parts.slice(0, -1).join('-');
      return {
        title: `Empresas em ${cidade}/${uf} | Parafa`,
        description: `Encontre empresas cadastradas em ${cidade}, ${uf}: telefone, endereço, horários e avaliações.`,
        openGraph: {
          title: `Empresas em ${cidade}/${uf} | Parafa`,
          description: `Busque empresas em ${cidade}, ${uf} com telefone, endereço e avaliações.`,
        },
      };
    }
    
    return {
      title: "Página não encontrada | Parafa",
    };
  } catch {
    return {
      title: "Erro ao carregar página | Parafa",
    };
  }
}

export default async function SlugPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    const slugLower = slug.toLowerCase();
    
    // Verifica se é um estado pelo nome
    const uf = estadoNomeParaUF[slugLower];
    if (uf) {
      const estadoNomeFormatado = ufParaNome[uf];
      const empresasData = await fetchEmpresas({ state: uf, include_inactive: true, per_page: 20 });
      const cidades = await fetchCidades(uf);

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
                  <span className="font-medium text-primary-foreground">{estadoNomeFormatado}</span>
                </nav>

                <div className="mt-6 flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-secondary text-sm font-extrabold text-primary">
                    {uf}
                  </span>
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                      Empresas em {estadoNomeFormatado}
                    </h1>
                    <p className="mt-1 text-sm text-primary-foreground/80">
                      {empresasData.data.length} empresas cadastradas
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="mx-auto max-w-6xl px-5 py-12">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-card-foreground">Cidades</h2>
              <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cidades.slice(0, 12).map((cidade) => (
                  <Link
                    key={cidade.id}
                    href={`/${cidade.url}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-extrabold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      {cidade.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-semibold text-card-foreground">
                      {cidade.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {cidade.customers_count}
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>

              <h2 className="mb-6 text-2xl font-bold tracking-tight text-card-foreground">Empresas</h2>
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

              <div className="mt-14">
                <AdSlot format="leaderboard" />
              </div>
            </div>
          </main>

          <SiteFooter />
        </div>
      );
    }
    
    // Verifica se é uma cidade pelo formato cidade-uf
    const parts = slug.split('-');
    if (parts.length >= 2) {
      const uf = parts[parts.length - 1].toUpperCase();
      const cidade = parts.slice(0, -1).join('-');
      
      // Buscar empresas desta cidade
      const empresasData = await fetchEmpresas({
        city_url: cidade,
        state: uf,
        include_inactive: true,
        per_page: 50,
      });
      const empresasCidade = empresasData.data;

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
                  <span className="font-medium text-primary-foreground">{cidade}/{uf}</span>
                </nav>

                <div className="mt-6">
                  <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                    Empresas em {cidade}
                  </h1>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    {empresasCidade.length} empresas cadastradas
                  </p>
                </div>
              </div>
            </section>

            <div className="mx-auto max-w-6xl px-5 py-12">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {empresasCidade.map((empresa) => (
                  <EmpresaCard key={empresa.id} empresa={empresa} />
                ))}
              </div>

              {empresasCidade.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
                  <p className="mt-3 font-medium text-foreground">Nenhuma empresa encontrada nesta cidade</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tente outra cidade ou volte mais tarde.
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
    }
    
    notFound();
  } catch (error) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-center text-red-500">Erro ao carregar dados.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
