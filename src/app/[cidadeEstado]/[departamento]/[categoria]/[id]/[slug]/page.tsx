import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Star, BadgeCheck, ArrowRight, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchEmpresa } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    cidadeEstado: string;
    departamento: string;
    categoria: string;
    id: string;
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const empresa = await fetchEmpresa(id);
    
    if (!empresa) {
      return {
        title: "Empresa não encontrada | Parafa",
        robots: {
          index: false,
        },
      };
    }

    return {
      title: `${empresa.name} | Parafa`,
      description: `${empresa.name} em ${empresa.city}, ${empresa.state}. ${empresa.description || ''}`,
      openGraph: {
        title: `${empresa.name} | Parafa`,
        description: `Encontre ${empresa.name} em ${empresa.city} com telefone, endereço e avaliações.`,
      },
    };
  } catch {
    return {
      title: "Erro ao carregar empresa | Parafa",
    };
  }
}

export default async function EmpresaDetalhePage({ params }: PageProps) {
  try {
    const { id, cidadeEstado, departamento, categoria, slug } = await params;
    const empresa = await fetchEmpresa(id);
    
    if (!empresa) {
      notFound();
    }

    // Parse cidade-estado para exibição
    const [cidade, uf] = cidadeEstado.split('-');

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
                <Link href={`/estados/${uf.toLowerCase()}`} className="transition-colors hover:text-primary-foreground">
                  {uf}
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="font-medium text-primary-foreground">{empresa.name}</span>
              </nav>

              <div className="mt-6 flex items-start gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-secondary text-primary text-2xl font-bold">
                  {empresa.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                      {empresa.name}
                    </h1>
                    {empresa.status === "1" && (
                      <BadgeCheck className="mt-1 size-6 shrink-0 text-primary" />
                    )}
                  </div>
                  {empresa.slogan && (
                    <p className="mt-2 text-lg text-primary-foreground/80">{empresa.slogan}</p>
                  )}
                  <p className="mt-2 text-sm text-primary-foreground/70">
                    {empresa.category_name || 'Categoria'} • {empresa.neighborhood}, {empresa.city}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-card-foreground">Sobre</h2>
                  <p className="mt-3 text-muted-foreground">
                    {empresa.description || 'Sem descrição disponível.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-card-foreground">Endereço</h2>
                  <div className="mt-3 space-y-2 text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-5 shrink-0" />
                      <span>
                        {empresa.address}, {empresa.number}
                        {empresa.complement && ` - ${empresa.complement}`}
                        <br />
                        {empresa.neighborhood}
                        <br />
                        {empresa.city} - {empresa.state}
                        <br />
                        CEP: {empresa.zipcode}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-card-foreground">Contato</h2>
                  <div className="mt-3 space-y-3 text-muted-foreground">
                    {empresa.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="size-5" />
                        <a href={`mailto:${empresa.email}`} className="hover:text-primary">
                          {empresa.email}
                        </a>
                      </p>
                    )}
                    {empresa.site && (
                      <p className="flex items-center gap-2">
                        <Globe className="size-5" />
                        <a href={empresa.site} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                          {empresa.site}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-card-foreground">Informações</h2>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categoria</span>
                      <span className="font-medium text-card-foreground">{empresa.category_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cidade</span>
                      <span className="font-medium text-card-foreground">{empresa.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado</span>
                      <span className="font-medium text-card-foreground">{empresa.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bairro</span>
                      <span className="font-medium text-card-foreground">{empresa.neighborhood}</span>
                    </div>
                  </div>
                </div>

                <AdSlot format="rectangle" />
              </div>
            </div>

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
          <p className="text-center text-red-500">Erro ao carregar dados da empresa.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
