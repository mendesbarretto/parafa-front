import { EmpresasClient } from "./EmpresasClient";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Empresas cadastradas | Parafa",
  description:
    "Explore empresas cadastradas no Parafa por categoria e cidade: telefone, endereço, horário de atendimento e avaliações.",
  openGraph: {
    title: "Empresas cadastradas | Parafa",
    description: "Encontre empresas por categoria e cidade com telefone, endereço e avaliações.",
  },
};

function EmpresasLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="hero-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
            guia de empresas
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl">
            Empresas cadastradas
          </h1>
          <p className="mt-4 max-w-xl text-primary-foreground/80">
            Carregando empresas...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmpresasPage() {
  return (
    <Suspense fallback={<EmpresasLoading />}>
      <EmpresasClient />
    </Suspense>
  );
}
