import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchEstados } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Empresas por estado | Parafa",
  description:
    "Busque empresas cadastradas no Parafa em todos os estados do Brasil: telefone, endereço, horários e avaliações.",
  openGraph: {
    title: "Empresas por estado | Parafa",
    description: "Navegue pelo guia de empresas em todos os estados brasileiros.",
  },
};

export const dynamic = 'force-dynamic';

async function EstadosPage() {
  const estados = await fetchEstados();

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
              Busque por estado
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              Navegue pelas empresas cadastradas em cada região do Brasil.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {estados.map((uf) => (
              <Link
                key={uf}
                href={`/estados/${uf.toLowerCase()}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-extrabold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {uf}
                </span>
                <span className="min-w-0 flex-1 truncate font-semibold text-card-foreground">
                  {uf}
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

export default EstadosPage;
