import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function EstadosLoading() {
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
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="size-11 shrink-0 animate-pulse rounded-xl bg-secondary" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
