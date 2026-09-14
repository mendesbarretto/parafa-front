import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchCidades } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cidades | Parafa",
  description:
    "Navegue pelas empresas cadastradas em todas as cidades do Brasil: telefone, endereço, horários e avaliações.",
  openGraph: {
    title: "Cidades | Parafa",
    description: "Encontre empresas por cidade em todo o Brasil com telefone, endereço e avaliações.",
  },
};

export const dynamic = 'force-dynamic';

async function CidadesPage() {
  const cidades = await fetchCidades();

  // Agrupar cidades por estado
  const cidadesPorEstado = cidades.reduce((acc, cidade) => {
    const estado = cidade.state;
    if (!acc[estado]) {
      acc[estado] = [];
    }
    acc[estado].push(cidade);
    return acc;
  }, {} as Record<string, typeof cidades>);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-surface">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
              guia de empresas
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
              Cidades
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              Navegue pelas empresas cadastradas em cada cidade do Brasil.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12">
          {Object.entries(cidadesPorEstado)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([estado, cidadesEstado]) => (
              <div key={estado} className="mb-12">
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-card-foreground">
                  {estado}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cidadesEstado
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((cidade) => (
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
              </div>
            ))}
        </div>

        <div className="mx-auto max-w-6xl px-5 py-12">
          <AdSlot format="leaderboard" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default CidadesPage;
