"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export function ContatoClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Aqui você implementaria a chamada API real
      // Por enquanto, simula sucesso
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground">Mensagem enviada!</h1>
            <p className="mt-4 text-muted-foreground">
              Obrigado pelo contato. Responderemos em breve.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Enviar outra mensagem
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-surface">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
              contato
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
              Entre em contato
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              Dúvidas, sugestões ou parcerias? Estamos aqui para ajudar.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
                Informações de contato
              </h2>
              <p className="mt-4 text-muted-foreground">
                Entre em contato conosco através dos canais abaixo:
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <Mail className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Email</h3>
                    <p className="mt-1 text-muted-foreground">contato@parafa.com.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <Phone className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Telefone</h3>
                    <p className="mt-1 text-muted-foreground">(41) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <MapPin className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Endereço</h3>
                    <p className="mt-1 text-muted-foreground">
                      Curitiba, Paraná - Brasil
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
                Envie uma mensagem
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-card-foreground">
                    Nome *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-card-foreground outline-none transition-colors focus:border-primary"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-card-foreground">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-card-foreground outline-none transition-colors focus:border-primary"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-card-foreground">
                    Assunto *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-card-foreground outline-none transition-colors focus:border-primary"
                    placeholder="Assunto da mensagem"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-card-foreground">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-card-foreground outline-none transition-colors focus:border-primary resize-none"
                    placeholder="Sua mensagem..."
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="size-4" />
                      Enviar mensagem
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
