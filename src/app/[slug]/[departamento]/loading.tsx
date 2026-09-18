import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EmpresaGridSkeleton } from "@/components/EmpresaGridSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="hero-surface">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="h-4 w-48 animate-pulse rounded bg-primary-foreground/20" />
            <div className="mt-6 h-10 w-96 animate-pulse rounded bg-primary-foreground/20" />
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <EmpresaGridSkeleton />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
