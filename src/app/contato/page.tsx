import { ContatoClient } from "./ContatoClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Parafa",
  description: "Entre em contato conosco. Dúvidas, sugestões ou parcerias.",
  openGraph: {
    title: "Contato | Parafa",
    description: "Entre em contato conosco. Dúvidas, sugestões ou parcerias.",
  },
};

export default function ContatoPage() {
  return <ContatoClient />;
}
