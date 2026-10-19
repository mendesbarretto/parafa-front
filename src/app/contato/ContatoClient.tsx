"use client";

import { FormEvent, useState } from "react";
import { CheckCircle, Mail, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const inputClass = "mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-card-foreground outline-none focus:border-primary";

export function ContatoClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [protocol, setProtocol] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = event.currentTarget;
    const values = new FormData(form);

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          email: values.get("email"),
          phone: values.get("phone"),
          company: values.get("company"),
          message: values.get("message"),
          website: values.get("website"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Não foi possível enviar a mensagem.");
      setProtocol(result.protocol);
      form.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível enviar a mensagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="hero-surface">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">contato</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">Entre em contato</h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">Dúvidas, sugestões ou correções de informações? Envie sua mensagem.</p>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Fale com o Parafa</h2>
            <p className="mt-4 text-muted-foreground">Use o formulário ou escreva diretamente para:</p>
            <a href="mailto:contato@parafa.com.br" className="mt-5 inline-flex items-center gap-3 font-medium text-primary hover:underline">
              <Mail className="size-5" /> contato@parafa.com.br
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            {protocol ? (
              <div role="status" className="py-8 text-center">
                <CheckCircle className="mx-auto size-12 text-green-600" />
                <h2 className="mt-4 text-2xl font-bold">Mensagem recebida</h2>
                <p className="mt-3 text-muted-foreground">Responderemos pelo e-mail informado.</p>
                <p className="mt-3 text-sm text-muted-foreground">Protocolo: <strong>{protocol}</strong></p>
                <button type="button" onClick={() => setProtocol("")} className="mt-6 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-card-foreground">Envie uma mensagem</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <label className="block text-sm font-medium">Nome *
                    <input name="name" required minLength={2} maxLength={150} autoComplete="name" className={inputClass} />
                  </label>
                  <label className="block text-sm font-medium">E-mail *
                    <input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} />
                  </label>
                  <label className="block text-sm font-medium">Telefone
                    <input name="phone" type="tel" maxLength={30} autoComplete="tel" className={inputClass} />
                  </label>
                  <label className="block text-sm font-medium">CNPJ ou nome da empresa
                    <input name="company" maxLength={200} className={inputClass} />
                  </label>
                  <label className="block text-sm font-medium">Mensagem *
                    <textarea name="message" required minLength={10} maxLength={3000} rows={6} className={inputClass} />
                  </label>
                  <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                  {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                  <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-50">
                    <Send className="size-4" /> {loading ? "Enviando…" : "Enviar mensagem"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
