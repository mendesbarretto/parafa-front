import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  BadgeCheck,
  Globe,
  Mail,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchEmpresa, fetchEmpresas } from "@/lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const empresa = await fetchEmpresa(slug);
    if (!empresa) {
      return {
        title: "Empresa não encontrada | Parafa",
        robots: {
          index: false,
        },
      };
    }

    const title = `${empresa.name} — ${empresa.city}/${empresa.state} | Parafa`;
    const description = `${empresa.name} em ${empresa.neighborhood}, ${empresa.city}/${empresa.state}. ${empresa.description || 'Empresa cadastrada no Parafa'}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
    };
  } catch {
    return {
      title: "Erro ao carregar empresa | Parafa",
    };
  }
}

export default async function EmpresaPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    const empresa = await fetchEmpresa(slug);
    if (!empresa) {
      notFound();
    }

    const relacionadasData = await fetchEmpresas({ per_page: 4 });
    const relacionadas = relacionadasData.data.filter(
      (e) => e.id !== empresa.id && e.category_id === empresa.category_id,
    ).slice(0, 4);

    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <main>
          <section className="hero-surface">
            <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
              <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/70">
                <Link href="/" className="hover:text-primary-foreground">
                  Início
                </Link>
                <ChevronRight className="size-3.5" />
                <Link href="/empresas" className="hover:text-primary-foreground">
                  Empresas
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="text-primary-foreground">Categoria</span>
              </nav>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  Categoria
                </span>
              </div>

              <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl">
                {empresa.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/80">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" /> {empresa.neighborhood} — {empresa.city}/{empresa.state}
                </span>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-8">
                <section className="rounded-2xl border border-border bg-card p-7">
                  <h2 className="text-lg font-bold text-card-foreground">Sobre a empresa</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{empresa.description || 'Sem descrição disponível'}</p>
                </section>

                <section className="rounded-2xl border border-border bg-card p-7">
                  <h2 className="text-lg font-bold text-card-foreground">Localização</h2>
                  <div className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                    <p className="inline-flex items-center gap-2">
                      <MapPin className="size-4 shrink-0 text-primary" />
                      {empresa.neighborhood}
                    </p>
                    <p className="pl-6">
                      {empresa.city}/{empresa.state}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(
                      `${empresa.neighborhood}, ${empresa.city}, ${empresa.state}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Abrir no Google Maps <ChevronRight className="size-4" />
                  </a>
                </section>

                <AdSlot format="leaderboard" />
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                  <h2 className="text-base font-bold text-card-foreground">Contato</h2>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-muted-foreground">Contato não disponível</p>
                  </div>
                </div>

                <AdSlot format="rectangle" />
              </aside>
            </div>

            {relacionadas.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold text-card-foreground">Empresas relacionadas</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {relacionadas.map((rel) => (
                    <article
                      key={rel.id}
                      className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
                    >
                      <h3 className="text-base font-semibold text-card-foreground">{rel.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{rel.neighborhood} — {rel.city}</p>
                      <Link
                        href={`/empresas/${rel.id}`}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                      >
                        Ver <ArrowRight className="size-3.5" />
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}
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