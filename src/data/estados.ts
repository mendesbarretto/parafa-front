import { empresas, type Empresa } from "./empresas";

export interface Estado {
  uf: string;
  nome: string;
}

export const estados: Estado[] = [
  { uf: "SP", nome: "São Paulo" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "PR", nome: "Paraná" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "BA", nome: "Bahia" },
  { uf: "GO", nome: "Goiás" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "CE", nome: "Ceará" },
  { uf: "PA", nome: "Pará" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "PI", nome: "Piauí" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "AC", nome: "Acre" },
  { uf: "AP", nome: "Amapá" },
  { uf: "RR", nome: "Roraima" },
];

export function getEstado(uf: string) {
  if (!uf) return undefined;
  return estados.find((e) => e.uf.toLowerCase() === uf.toLowerCase());
}

export function getEmpresasPorEstado(uf: string): Empresa[] {
  return empresas.filter((e) => e.uf.toLowerCase() === uf.toLowerCase());
}
