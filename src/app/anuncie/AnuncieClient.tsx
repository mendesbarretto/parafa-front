"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Star,
  TrendingUp,
  Users,
  BadgeCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { categorias } from "@/data/categorias";
import { estados } from "@/data/estados";

const beneficios = [
  {
    icon: TrendingUp,
    titulo: "Mais visibilidade",
    texto: "Sua empresa aparece nas buscas de quem procura o seu serviço na sua cidade.",
  },
  {
    icon: Users,
    titulo: "Novos clientes",
    texto: "Milhares de pessoas usam o Parafa todos os dias para encontrar negócios locais.",
  },
  {
    icon: Star,
    titulo: "Avaliações",
    texto: "Receba avaliações de clientes e construa sua reputação online.",
  },
  {
    icon: BadgeCheck,
    titulo: "Selo de verificação",
    texto: "Empresas verificadas ganham destaque e mais confiança dos visitantes.",
  },
];

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-card-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

export function AnuncieClient() {
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-surface">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/70">
              <Link href="/" className="transition-colors hover:text-primary-foreground">
                Início
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="font-medium text-primary-foreground">Anuncie grátis</span>
            </nav>
            <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              <Star className="size-3.5" /> Cadastro 100% gratuito
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
              Coloque sua empresa no mapa
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              Aumente sua visibilidade e seja encontrado por quem procura o seu serviço na sua
              cidade. Leva menos de 2 minutos.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} className="rounded-2xl border border-border bg-card p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-4 font-semibold text-card-foreground">{titulo}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-20">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-10">
            {enviado ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto size-12 text-primary" />
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-card-foreground">
                  Cadastro enviado!
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                  Recebemos os dados da sua empresa. Nossa equipe vai revisar as informações e
                  publicar seu anúncio em breve.
                </p>
                <Link
                  href="/empresas"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Ver empresas cadastradas <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
                  Cadastre sua empresa
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Preencha os dados abaixo. O cadastro é gratuito e sem compromisso.
                </p>

                <form
                  className="mt-8 grid gap-4 sm:grid-cols-2"
                  onSubmit={(ev) => {
                    ev.preventDefault();
                    setEnviado(true);
                  }}
                >
                  <label className="grid gap-1.5 sm:col-span-2">
                    <span className="text-sm font-medium text-card-foreground">
                      Nome da empresa *
                    </span>
                    <input required className={inputClass} placeholder="Ex: Padaria Pão Dourado" />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-card-foreground">Categoria *</span>
                    <select required className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Selecione
                      </option>
                      {categorias.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.nome}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-card-foreground">Telefone *</span>
                    <input
                      required
                      type="tel"
                      className={inputClass}
                      placeholder="(41) 3000-0000"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-card-foreground">WhatsApp</span>
                    <input type="tel" className={inputClass} placeholder="(41) 99999-0000" />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-card-foreground">E-mail</span>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="contato@suaempresa.com.br"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-card-foreground">Cidade *</span>
                    <input required className={inputClass} placeholder="Ex: Curitiba" />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-card-foreground">Estado *</span>
                    <select required className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Selecione
                      </option>
                      {estados.map((e) => (
                        <option key={e.uf} value={e.uf}>
                          {e.nome}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5 sm:col-span-2">
                    <span className="text-sm font-medium text-card-foreground">
                      Descrição da empresa
                    </span>
                    <textarea
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Conte o que sua empresa faz, horário de atendimento e diferenciais."
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 sm:col-span-2"
                  >
                    Cadastrar empresa grátis <ArrowRight className="size-4" />
                  </button>

                  <p className="text-center text-xs text-muted-foreground sm:col-span-2">
                    Ao cadastrar, você concorda com os termos de uso do Parafa.
                  </p>
                </form>
              </>
            )}
          </div>

          <div className="mt-14">
            <AdSlot format="leaderboard" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
