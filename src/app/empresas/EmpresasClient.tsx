"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, MapPin, Star, BadgeCheck, ArrowRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { empresas } from "@/data/empresas";

export function EmpresasClient() {
  const [termo, setTermo] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const categorias = useMemo(
    () => ["Todas", ...Array.from(new Set(empresas.map((e) => e.categoria)))],
    [],
  );

  const lista = useMemo(() => {
    const t = termo.trim().toLowerCase();
    return empresas.filter((e) => {
      const okCat = categoria === "Todas" || e.categoria === categoria;
      const okTermo =
        !t ||
        e.nome.toLowerCase().includes(t) ||
        e.categoria.toLowerCase().includes(t) ||
        e.bairro.toLowerCase().includes(t) ||
        e.cidade.toLowerCase().includes(t);
      return okCat && okTermo;
    });
  }, [termo, categoria]);

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

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((e) => (
              <article
                key={e.slug}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                    {e.categoria}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-card-foreground">
                    <Star className="size-4 fill-accent text-accent" />
                    {e.nota.toFixed(1)}
                  </span>
                </div>

                <h2 className="mt-4 flex items-start gap-1.5 text-base font-semibold leading-snug text-card-foreground">
                  {e.nome}
                  {e.verificada && <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.descricao}</p>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4" /> {e.bairro} — {e.cidade}/{e.uf}
                  </span>
                  <Link
                    href={`/empresas/${e.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
                  >
                    Ver <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {lista.length === 0 && (
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
