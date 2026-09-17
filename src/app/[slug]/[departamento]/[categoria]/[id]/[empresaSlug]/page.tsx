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
    slug: string;
    departamento: string;
    categoria: string;
    id: string;
    empresaSlug: string;
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
      description: empresa.slogan || empresa.description || `${empresa.name} - ${empresa.city}, ${empresa.state}`,
      openGraph: {
        title: `${empresa.name} | Parafa`,
        description: empresa.slogan || empresa.description || `${empresa.name} - ${empresa.city}, ${empresa.state}`,
      },
    };
  } catch {
    return {
      title: "Erro ao carregar empresa | Parafa",
    };
  }
}

export default async function EmpresaDetailPage({ params }: PageProps) {
  try {
    const { slug, departamento, categoria, id } = await params;
    const empresa = await fetchEmpresa(id);
    
    if (!empresa) {
      notFound();
    }

    const addressDisplay = empresa.formatted_address || 
      `${empresa.address}, ${empresa.number}${empresa.complement ? ` - ${empresa.complement}` : ''}`;

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
                <Link href={`/${slug}`} className="transition-colors hover:text-primary-foreground">
                  {empresa.city}, {empresa.state}
                </Link>
                <ChevronRight className="size-3.5" />
                <Link href={`/${slug}/${departamento}`} className="transition-colors hover:text-primary-foreground">
                  {empresa.department_name || departamento.replace(/-/g, ' ')}
                </Link>
                <ChevronRight className="size-3.5" />
                <Link href={`/${slug}/${departamento}/${categoria}`} className="transition-colors hover:text-primary-foreground">
                  {empresa.category_name || categoria.replace(/-/g, ' ')}
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="font-medium text-primary-foreground">{empresa.name}</span>
              </nav>

              <div className="mt-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                      {empresa.name}
                    </h1>
                    {empresa.status === "1" && (
                      <div title="Empresa Verificada">
                        <BadgeCheck className="size-6 shrink-0 text-primary" />
                      </div>
                    )}
                  </div>
                  {empresa.slogan && (
                    <p className="mt-2 text-lg text-primary-foreground/90">{empresa.slogan}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-bold tracking-tight text-card-foreground">Sobre</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {empresa.description || 'Sem descrição disponível.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-bold tracking-tight text-card-foreground">Endereço</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-card-foreground">{addressDisplay}</p>
                        <p className="text-sm text-muted-foreground">
                          {empresa.neighborhood} — {empresa.city}/{empresa.state}
                        </p>
                        <p className="text-sm text-muted-foreground">CEP: {empresa.zipcode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-bold tracking-tight text-card-foreground">Contato</h2>
                  <div className="space-y-3">
                    {empresa.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="size-5 shrink-0 text-primary" />
                        <a
                          href={`tel:${empresa.phone_tel || empresa.phone.replace(/\D/g, '')}`}
                          className="font-medium text-card-foreground hover:text-primary transition-colors"
                        >
                          {empresa.phone}
                        </a>
                      </div>
                    )}
                    {empresa.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="size-5 shrink-0 text-primary" />
                        <a
                          href={`mailto:${empresa.email}`}
                          className="font-medium text-card-foreground hover:text-primary transition-colors"
                        >
                          {empresa.email}
                        </a>
                      </div>
                    )}
                    {empresa.site && (
                      <div className="flex items-center gap-3">
                        <Globe className="size-5 shrink-0 text-primary" />
                        <a
                          href={empresa.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-card-foreground hover:text-primary transition-colors"
                        >
                          {empresa.site}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-xl font-bold tracking-tight text-card-foreground">Informações</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Categoria</span>
                      <span className="font-medium text-card-foreground">{empresa.category_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Departamento</span>
                      <span className="font-medium text-card-foreground">{empresa.department_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                        {empresa.status === "1" && (
                          <>
                            <BadgeCheck className="size-4" />
                            Verificada
                          </>
                        )}
                        {empresa.status !== "1" && "Não verificada"}
                      </span>
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
