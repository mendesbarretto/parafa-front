import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchCategorias } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorias | Parafa",
  description:
    "Navegue por todas as categorias do guia Parafa: restaurantes, hotéis, saúde, lojas, serviços e muito mais em todo o Brasil.",
  openGraph: {
    title: "Categorias | Parafa",
    description: "Encontre empresas por categoria: restaurantes, hotéis, saúde, lojas e serviços.",
  },
};

export const dynamic = 'force-dynamic';

async function CategoriasPage() {
  const categoriasData = await fetchCategorias();

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
              Categorias
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              Explore os negócios cadastrados por segmento de atuação.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriasData.data.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categorias/${categoria.url}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <span className="text-xl font-bold">{categoria.name.charAt(0)}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-card-foreground">{categoria.name}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {categoria.customers_count} empresas
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <AdSlot format="leaderboard" />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default CategoriasPage;
