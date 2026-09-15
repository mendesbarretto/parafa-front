"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export function BuscaClient() {
  const router = useRouter();
  const [termo, setTermo] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Ler parâmetros da URL ao carregar
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("q");
    const locationParam = params.get("l");
    
    if (searchParam) setTermo(searchParam);
    if (locationParam) setLocation(locationParam);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (termo.trim()) {
      params.append("search", termo.trim());
    }
    if (location.trim()) {
      params.append("location", location.trim());
    }
    router.push(`/empresas${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-surface">
          <div className="mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
              busca
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
              Encontre o que procura
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              Busque empresas, serviços e produtos em todo o Brasil
            </p>

            <form onSubmit={handleSearch} className="mt-8 mx-auto max-w-xl">
              <div className="flex w-full flex-col gap-2 rounded-2xl bg-card p-2 shadow-[var(--shadow-lift)] sm:flex-row">
                <label className="flex flex-1 items-center gap-2 px-3 py-2">
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                    className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="O que você procura?"
                  />
                </label>
                <span className="hidden w-px self-stretch bg-border sm:block" />
                <label className="flex flex-1 items-center gap-2 px-3 py-2">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="Cidade ou estado"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Buscar
                </button>
              </div>
            </form>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => { setTermo("restaurantes"); setLocation(""); }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Restaurantes
              </button>
              <button
                onClick={() => { setTermo("hotéis"); setLocation(""); }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Hotéis
              </button>
              <button
                onClick={() => { setTermo("médicos"); setLocation(""); }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Médicos
              </button>
              <button
                onClick={() => { setTermo("mecânicos"); setLocation(""); }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Mecânicos
              </button>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
            Sugestões de busca
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { termo: "pizzaria", location: "curitiba-pr" },
              { termo: "dentista", location: "sao-paulo" },
              { termo: "advogado", location: "rio-de-janeiro" },
              { termo: "eletricista", location: "belo-horizonte" },
              { termo: "farmácia", location: "porto-alegre" },
              { termo: "escola", location: "salvador" },
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setTermo(suggestion.termo);
                  setLocation(suggestion.location);
                }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
              >
                <Search className="size-5 shrink-0 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-card-foreground">{suggestion.termo}</p>
                  <p className="text-sm text-muted-foreground">{suggestion.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
