import { AnuncieClient } from "./AnuncieClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anuncie grátis sua empresa | Parafa",
  description:
    "Cadastre sua empresa grátis no Parafa e seja encontrado por milhares de clientes na sua cidade. Leva menos de 2 minutos.",
  openGraph: {
    title: "Anuncie grátis sua empresa | Parafa",
    description: "Cadastro gratuito de empresas: aumente sua visibilidade e receba avaliações de clientes.",
  },
};

export default function AnunciePage() {
  return <AnuncieClient />;
}
