import type { LucideIcon } from "lucide-react";
import {
  UtensilsCrossed,
  Hotel,
  Car,
  Stethoscope,
  Wrench,
  Scissors,
  ShoppingBag,
  Building2,
  Footprints,
  SprayCan,
  Hammer,
  CarFront,
  Puzzle,
  Shirt,
} from "lucide-react";
import { empresas, type Empresa } from "./empresas";

export interface Categoria {
  slug: string;
  nome: string;
  total: string;
  icon: LucideIcon;
  /** Nomes de categoria usados no cadastro das empresas que pertencem a este grupo. */
  aliases: string[];
}

export const categorias: Categoria[] = [
  { slug: "restaurantes", nome: "Restaurantes", total: "182.410", icon: UtensilsCrossed, aliases: ["Restaurantes"] },
  { slug: "hoteis-e-pousadas", nome: "Hotéis e Pousadas", total: "41.902", icon: Hotel, aliases: ["Hotéis e Pousadas"] },
  { slug: "automoveis", nome: "Automóveis", total: "96.331", icon: Car, aliases: ["Automóveis"] },
  { slug: "saude", nome: "Saúde", total: "128.774", icon: Stethoscope, aliases: ["Saúde"] },
  { slug: "servicos-e-reformas", nome: "Serviços e Reformas", total: "204.588", icon: Wrench, aliases: ["Serviços e Reformas"] },
  { slug: "beleza", nome: "Beleza", total: "87.140", icon: Scissors, aliases: ["Beleza"] },
  { slug: "lojas-e-comercio", nome: "Lojas e Comércio", total: "310.226", icon: ShoppingBag, aliases: ["Lojas e Comércio"] },
  { slug: "industrias", nome: "Indústrias", total: "63.019", icon: Building2, aliases: ["Indústrias"] },
  { slug: "calcados", nome: "Calçados", total: "18.204", icon: Footprints, aliases: ["Calçados"] },
  { slug: "produtos-para-limpeza", nome: "Produtos p/ Limpeza", total: "9.872", icon: SprayCan, aliases: ["Produtos p/ Limpeza"] },
  { slug: "ferramentas", nome: "Ferramentas", total: "22.516", icon: Hammer, aliases: ["Ferramentas", "Ferragens"] },
  { slug: "concessionarias", nome: "Concessionárias", total: "14.930", icon: CarFront, aliases: ["Concessionárias"] },
  { slug: "brinquedos", nome: "Brinquedos", total: "11.348", icon: Puzzle, aliases: ["Brinquedos"] },
  { slug: "confeccoes", nome: "Confecções", total: "27.665", icon: Shirt, aliases: ["Confecções", "Roupas Unissex"] },
];

export function getCategoria(slug: string) {
  if (!slug) return undefined;
  return categorias.find((c) => c.slug === slug);
}

export function getEmpresasPorCategoria(slug: string): Empresa[] {
  const categoria = getCategoria(slug);
  if (!categoria) return [];
  return empresas.filter((e) => categoria.aliases.includes(e.categoria));
}
