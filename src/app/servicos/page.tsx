import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchDepartamentos } from "@/lib/api";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: '/servicos' },
  title: "Serviços | Parafa",
  description: "Encontre serviços por departamento em todo o Brasil.",
  openGraph: {
    title: "Serviços | Parafa",
    description: "Encontre serviços por departamento em todo o Brasil.",
  },
};

export default async function ServicosPage() {
    const departamentos = await fetchDepartamentos();

    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <main>
          <section className="hero-surface">
            <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                serviços
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
                Categorias de Serviços
              </h1>
              <p className="mt-4 max-w-xl text-primary-foreground/80">
                Navegue pelos departamentos e encontre o serviço que você precisa.
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {departamentos.map((dept) => (
                <article
                  key={dept.url}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
                >
                  <h2 className="text-xl font-bold text-card-foreground">{dept.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {dept.categories_count ?? 0} categorias
                  </p>

                  <Link
                    href={`/servicos/${dept.url}`}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Ver todas <ArrowRight className="size-3.5" />
                  </Link>
                </article>
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
