import { HomeClient } from "./HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parafa | Guia de empresas e serviços no Brasil",
  description:
    "Encontre hotéis, lojas, restaurantes e serviços mais bem avaliados perto de você. Mais de 1,7 milhão de empresas cadastradas no Brasil.",
  openGraph: {
    title: "Parafa | Guia de empresas e serviços no Brasil",
    description:
      "Busque empresas por cidade, estado e categoria. Mais de 1,7 milhão de negócios cadastrados.",
  },
};

export default function Home() {
  return <HomeClient />;
}
