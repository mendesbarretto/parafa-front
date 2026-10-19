import { EmpresasClient } from "./EmpresasClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: '/empresas' },
  title: "Empresas cadastradas | Parafa",
  description:
    "Explore empresas cadastradas no Parafa por categoria e cidade: telefone, endereço, contatos disponíveis.",
  openGraph: {
    title: "Empresas cadastradas | Parafa",
    description: "Encontre empresas por categoria e cidade com telefone e endereço.",
  },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EmpresasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const location = typeof params.location === "string" ? params.location : "";
  const requestedPage = typeof params.page === "string" ? Number(params.page) : 1;
  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, 100)
    : 1;

  return (
    <EmpresasClient
      key={JSON.stringify([search, location, page])}
      initialSearch={search}
      initialLocation={location}
      initialPage={page}
    />
  );
}
