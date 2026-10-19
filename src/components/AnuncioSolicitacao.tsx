'use client';

import { FormEvent, useState } from 'react';

export function AnuncioSolicitacao({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [protocol, setProtocol] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = event.currentTarget;
    const values = new FormData(form);

    try {
      const response = await fetch('/api/anuncio-solicitacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: Number(customerId),
          name: values.get('name'),
          email: values.get('email'),
          action: values.get('action'),
          message: values.get('message'),
          website: values.get('website'),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Não foi possível enviar a solicitação.');
      setProtocol(result.protocol);
      form.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível enviar a solicitação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold text-card-foreground">Você é dono desta empresa?</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Encontrou um erro ou quer retirar o anúncio? Envie uma solicitação para nossa equipe analisar.
      </p>
      {protocol ? (
        <p className="mt-4 text-sm text-foreground" role="status">
          Solicitação recebida. Protocolo: <strong>{protocol}</strong>
        </p>
      ) : open ? (
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block text-sm font-medium">Pedido
            <select name="action" required className="mt-1 w-full rounded-lg border border-border bg-background p-3">
              <option value="correction">Corrigir anúncio</option>
              <option value="removal">Retirar anúncio</option>
            </select>
          </label>
          <label className="block text-sm font-medium">Seu nome
            <input name="name" required minLength={2} maxLength={150} autoComplete="name" className="mt-1 w-full rounded-lg border border-border bg-background p-3" />
          </label>
          <label className="block text-sm font-medium">Seu e-mail
            <input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 w-full rounded-lg border border-border bg-background p-3" />
          </label>
          <label className="block text-sm font-medium">Explique o pedido
            <textarea name="message" required minLength={10} maxLength={3000} rows={5} className="mt-1 w-full rounded-lg border border-border bg-background p-3" />
          </label>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} type="submit" className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50">
            {loading ? 'Enviando…' : 'Enviar solicitação'}
          </button>
        </form>
      ) : (
        <button onClick={() => setOpen(true)} className="mt-5 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground">
          Entrar em contato
        </button>
      )}
    </section>
  );
}
