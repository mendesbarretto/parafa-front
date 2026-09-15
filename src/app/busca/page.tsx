import { BuscaClient } from "./BuscaClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Busca | Parafa",
  description: "Busque empresas, serviços e produtos em todo o Brasil.",
  openGraph: {
    title: "Busca | Parafa",
    description: "Busque empresas, serviços e produtos em todo o Brasil.",
  },
};

export default function BuscaPage() {
  return <BuscaClient />;
}
