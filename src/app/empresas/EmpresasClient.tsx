"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, BadgeCheck, ArrowRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchEmpresas, type Empresa } from "@/lib/api";

// MapPin já está importado acima

export function EmpresasClient() {
  const searchParams = useSearchParams();
  const [termo, setTermo] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [categoria, setCategoria] = useState("Todas");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmpresas();
  }, [termo, location]);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const params: { per_page?: number; search?: string; state?: string } = { per_page: 20 };
      
      if (termo.trim()) {
        params.search = termo.trim();
      }
      
      if (location.trim()) {
        // Verificar se é um estado (2 letras)
        const uf = location.trim().toUpperCase();
        if (uf.length === 2) {
          params.state = uf;
        }
      }
      
      const data = await fetchEmpresas(params);
      setEmpresas(data.data);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  const categorias = useMemo(
    () => ["Todas", ...Array.from(new Set(empresas.map((e) => e.category_name || "Sem categoria")))],
    [empresas],
  );

  const lista = useMemo(() => {
    const t = termo.trim().toLowerCase();
    const l = location.trim().toLowerCase();
    return empresas.filter((e) => {
      const catName = e.category_name || "Sem categoria";
      const okCat = categoria === "Todas" || catName === categoria;
      const okTermo =
        !t ||
        e.name.toLowerCase().includes(t) ||
        catName.toLowerCase().includes(t) ||
        e.neighborhood.toLowerCase().includes(t) ||
        e.city.toLowerCase().includes(t);
      
      const okLocation = !l || 
        e.city.toLowerCase().includes(l) ||
        e.state.toLowerCase().includes(l) ||
        e.neighborhood.toLowerCase().includes(l);
        
      return okCat && okTermo && okLocation;
    });
  }, [termo, location, categoria, empresas]);

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
              Empresas cadastradas
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              Telefone, endereço, horários e avaliações dos negócios da sua região.
            </p>

            <div className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-2xl bg-card p-2 shadow-[var(--shadow-lift)]">
              <label className="flex flex-1 items-center gap-2 px-3 py-2">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={termo}
                  onChange={(ev) => setTermo(ev.target.value)}
                  className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Buscar por nome, categoria ou bairro"
                />
              </label>
              <span className="hidden w-px self-stretch bg-border sm:block" />
              <label className="flex flex-1 items-center gap-2 px-3 py-2">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={location}
                  onChange={(ev) => setLocation(ev.target.value)}
                  className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Cidade ou estado"
                />
              </label>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  categoria === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-card-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {lista.length} {lista.length === 1 ? "empresa encontrada" : "empresas encontradas"}
          </p>

          {loading ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lista.map((e) => (
                <article
                  key={e.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                      {e.category_name || "Sem categoria"}
                    </span>
                    {e.status === "1" && (
                      <BadgeCheck className="size-4 shrink-0 text-primary" />
                    )}
                  </div>

                  <h2 className="mt-4 flex items-start gap-1.5 text-base font-semibold leading-snug text-card-foreground">
                    {e.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.description || 'Sem descrição'}</p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-4" /> {e.neighborhood} — {e.city}/{e.state}
                    </span>
                    <Link
                      href={e.url}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
                    >
                      Ver <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && lista.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
              <Phone className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">Nenhuma empresa encontrada</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente outro termo ou selecione outra categoria.
              </p>
            </div>
          )}

          <div className="mt-14">
            <AdSlot format="leaderboard" />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
