import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: '/anuncie' },
  title: "Cadastro de empresas | Parafa",
  description: "Informações sobre o cadastro de empresas no Parafa.",
  robots: { index: false },
};

export default function AnunciePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground">Cadastro de empresas</h1>
        <p className="mt-5 text-muted-foreground">
          Estamos preparando o cadastro na nova versão do Parafa. Por enquanto, você pode
          consultar as empresas que já estão publicadas.
        </p>
        <Link href="/empresas" className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
          Ver empresas
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
