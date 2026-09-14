"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, MapPin, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchCategorias, fetchEmpresas, type Categoria, type Empresa } from "@/lib/api";
import { EmpresaCard } from "@/components/EmpresaCard";

export function EmpresasClient() {
  const [termo, setTermo] = useState(() =>
    typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("search") || "",
  );
  const [location, setLocation] = useState(() =>
    typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("location") || "",
  );
  const [categoria, setCategoria] = useState("Todas");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const page = Number.parseInt(new URLSearchParams(window.location.search).get("page") || "1", 10);
    return Number.isFinite(page) && page > 0 ? page : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<Categoria[]>([]);

  useEffect(() => {
    fetchCategorias()
      .then((response) => setCategoriasDisponiveis(response.data))
      .catch((error) => console.error("Erro ao carregar categorias:", error));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        const params: {
          per_page?: number;
          search?: string;
          state?: string;
          category_id?: number;
          page?: number;
        } = {
          per_page: 20,
          page: currentPage,
        };

        if (termo.trim()) params.search = termo.trim();

        const uf = location.trim().toUpperCase();
        if (uf.length === 2) params.state = uf;

        if (categoria !== "Todas") {
          const selected = categoriasDisponiveis.find(
            (item) => item.name === categoria,
          );
          if (selected) params.category_id = selected.id;
        }

        const data = await fetchEmpresas(params);
        setEmpresas(data.data);
        setTotalPages(data.meta.last_page);
        setTotalResults(data.meta.total);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        setEmpresas([]);
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [categoria, categoriasDisponiveis, currentPage, location, termo]);

  const categorias = useMemo(
    () => ["Todas", ...categoriasDisponiveis.map((item) => item.name)],
    [categoriasDisponiveis],
  );

  const lista = useMemo(() => empresas, [empresas]);

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
                  onChange={(ev) => {
                    setTermo(ev.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Buscar por nome, categoria ou bairro"
                />
              </label>
              <span className="hidden w-px self-stretch bg-border sm:block" />
              <label className="flex flex-1 items-center gap-2 px-3 py-2">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={location}
                  onChange={(ev) => {
                    setLocation(ev.target.value);
                    setCurrentPage(1);
                  }}
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
                onClick={() => {
                  setCategoria(c);
                  setCurrentPage(1);
                }}
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
            {totalResults} {totalResults === 1 ? "empresa encontrada" : "empresas encontradas"}
            {totalPages > 1 && ` (página ${currentPage} de ${totalPages})`}
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
                <EmpresaCard key={e.id} empresa={e} />
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

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-4" />
                Anterior
              </button>
              
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
                <ChevronRight className="size-4" />
              </button>
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
