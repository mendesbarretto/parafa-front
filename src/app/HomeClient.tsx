"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Building2,
  UtensilsCrossed,
  Hotel,
  Car,
  Stethoscope,
  Wrench,
  Scissors,
  ShoppingBag,
  ArrowRight,
  Star,
  Loader2,
} from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useState, useEffect } from "react";
import { fetchEmpresas, type Empresa } from "@/lib/api";

const categorias = [
  { nome: "Perfumarias", icon: Scissors, total: "3.461", slug: "perfumarias" },
  { nome: "Clínicas de Estética", icon: Stethoscope, total: "1.608", slug: "clinicas-de-estetica" },
  { nome: "Barbearias", icon: Scissors, total: "1.264", slug: "barbearias" },
  { nome: "Produtos de Beleza", icon: ShoppingBag, total: "1.221", slug: "produtos-de-beleza" },
  { nome: "Cosméticos", icon: ShoppingBag, total: "387", slug: "cosmeticos" },
  { nome: "Construção e Decoração", icon: Wrench, total: "134.967", slug: "construcao-e-decoracao" },
  { nome: "Materiais de Construção", icon: Wrench, total: "17.182", slug: "materiais-de-construcao" },
  { nome: "Construtoras", icon: Building2, total: "7.782", slug: "construtoras" },
];

const estados = [
  { nome: "São Paulo", uf: "sp" },
  { nome: "Rio de Janeiro", uf: "rj" },
  { nome: "Minas Gerais", uf: "mg" },
  { nome: "Rio Grande do Sul", uf: "rs" },
  { nome: "Paraná", uf: "pr" },
  { nome: "Santa Catarina", uf: "sc" },
  { nome: "Bahia", uf: "ba" },
  { nome: "Goiás", uf: "go" },
];

export function HomeClient() {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [destaques, setDestaques] = useState<Empresa[]>([]);
  const [loadingDestaques, setLoadingDestaques] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  const loadDestaques = async () => {
    try {
      setLoadingDestaques(true);
      const data = await fetchEmpresas({ per_page: 6 });
      setDestaques(data.data);
    } catch (error) {
      console.error("Erro ao carregar destaques:", error);
    } finally {
      setLoadingDestaques(false);
    }
  };

  useEffect(() => {
    loadDestaques();
  }, []);

  const handleCategoryClick = (slug: string) => {
    setLoadingSlug(slug);
    router.push(`/categorias/${slug}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.append("search", searchTerm.trim());
    }
    if (locationTerm.trim()) {
      params.append("location", locationTerm.trim());
    }
    router.push(`/empresas${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-surface relative overflow-hidden">
          <div className="mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
              guia de empresas do brasil
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground md:text-6xl">
              Encontre o que você precisa, perto de você
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/80">
              Hotéis, lojas, restaurantes e serviços mais bem avaliados do país.
            </p>

            <form onSubmit={handleSearch} className="mx-auto mt-10 flex w-full flex-col gap-2 rounded-2xl bg-card p-2 shadow-[var(--shadow-lift)] sm:flex-row">
              <label className="flex flex-1 items-center gap-2 rounded-xl px-3 py-3">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="O que você está procurando?"
                />
              </label>
              <span className="hidden w-px self-stretch bg-border sm:block" />
              <label className="flex flex-1 items-center gap-2 rounded-xl px-3 py-3">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Cidade ou estado"
                />
              </label>
              <button
                type="submit"
                className="rounded-xl bg-accent px-7 py-3 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Buscar
              </button>
            </form>

            <p className="mt-6 text-sm text-primary-foreground/70">
              <strong className="text-primary-foreground">1.743.909</strong> empresas cadastradas em
              todo o Brasil
            </p>
          </div>
        </section>

        <section id="categorias" className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Categorias populares
              </h2>
              <p className="mt-2 text-muted-foreground">As buscas mais frequentes no Brasil.</p>
            </div>
            <Link
              href="/empresas"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              Ver todas <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map(({ nome, icon: Icon, total, slug }) => (
              <button
                key={nome}
                onClick={() => handleCategoryClick(slug)}
                disabled={loadingSlug === slug}
                className="group rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-soft)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {loadingSlug === slug ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </span>
                <h3 className="mt-4 font-semibold text-card-foreground">{nome}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{total} empresas</p>
              </button>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 pb-20">
          <AdSlot format="leaderboard" />
        </div>

        <section id="cadastros" className="border-y border-border bg-secondary/50">

          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Últimos cadastros</h2>
            <p className="mt-2 text-muted-foreground">
              Empresas que acabaram de entrar no guia.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loadingDestaques ? (
                [...Array(6)].map((_, i) => (
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
                ))
              ) : (
                destaques.map((e) => (
                  <article
                    key={e.id}
                    className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-soft)]"
                  >
                    <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                      {e.category_name || "Sem categoria"}
                    </span>
                    <h3 className="mt-4 text-base font-semibold leading-snug text-card-foreground">
                      {e.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{e.description || 'Sem descrição'}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4" /> {e.neighborhood} — {e.city}/{e.state}
                      </span>
                      <button
                        onClick={() => {
                          setLoadingSlug(e.id);
                          router.push(e.url);
                        }}
                        disabled={loadingSlug === e.id}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingSlug === e.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <>
                            Ver telefone <ArrowRight className="size-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="estados" className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Busque por estado</h2>
          <p className="mt-2 text-muted-foreground">
            Navegue pelas empresas cadastradas em cada região.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {estados.map((estado) => (
              <button
                key={estado.nome}
                onClick={() => {
                  setLoadingSlug(estado.uf);
                  router.push(`/estados/${estado.uf}`);
                }}
                disabled={loadingSlug === estado.uf}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingSlug === estado.uf ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  estado.nome
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 pb-16">
          <AdSlot format="billboard" />
        </div>

        <section id="anuncie" className="mx-auto max-w-6xl px-5 pb-24">

          <div className="hero-surface overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              <Star className="size-3.5" /> Cadastro gratuito
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
              Coloque sua empresa no mapa
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Aumente sua visibilidade e seja encontrado por quem procura o seu serviço na sua
              cidade.
            </p>
            <button
              onClick={() => {
                setLoadingSlug('anuncie');
                router.push('/anuncie');
              }}
              disabled={loadingSlug === 'anuncie'}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingSlug === 'anuncie' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Cadastrar empresa <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
