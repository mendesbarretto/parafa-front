import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronRight } from "lucide-react";

export default function EmpresaDetalheLoading() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-surface">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/70">
              <div className="h-4 w-12 animate-pulse rounded bg-secondary" />
              <ChevronRight className="size-3.5" />
              <div className="h-4 w-16 animate-pulse rounded bg-secondary" />
              <ChevronRight className="size-3.5" />
              <div className="h-4 w-16 animate-pulse rounded bg-secondary" />
              <ChevronRight className="size-3.5" />
              <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
            </nav>

            <div className="mt-6 flex items-start gap-4">
              <div className="size-16 animate-pulse rounded-2xl bg-secondary" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-8 w-3/4 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="h-6 w-20 animate-pulse rounded bg-secondary" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="h-6 w-20 animate-pulse rounded bg-secondary" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="h-6 w-20 animate-pulse rounded bg-secondary" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="h-6 w-20 animate-pulse rounded bg-secondary" />
                <div className="mt-3 space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 h-64 animate-pulse" />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
