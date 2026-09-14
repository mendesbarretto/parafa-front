export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 bg-secondary/50 animate-pulse" />
      
      <main>
        <section className="hero-surface">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
            <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
            <div className="mt-6 h-12 w-96 animate-pulse rounded bg-secondary" />
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <div className="h-6 w-20 animate-pulse rounded-full bg-secondary" />
                <div className="mt-4 space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-12 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
