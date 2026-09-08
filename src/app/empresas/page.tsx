import { EmpresasClient } from "./EmpresasClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Empresas cadastradas | Parafa",
  description:
    "Explore empresas cadastradas no Parafa por categoria e cidade: telefone, endereço, horário de atendimento e avaliações.",
  openGraph: {
    title: "Empresas cadastradas | Parafa",
    description: "Encontre empresas por categoria e cidade com telefone, endereço e avaliações.",
  },
};

export default function EmpresasPage() {
  return <EmpresasClient />;
}
