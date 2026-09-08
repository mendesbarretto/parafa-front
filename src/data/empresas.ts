export interface Empresa {
  slug: string;
  nome: string;
  categoria: string;
  descricao: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  whatsapp?: string;
  site?: string;
  email?: string;
  horario: string;
  nota: number;
  avaliacoes: number;
  verificada: boolean;
  tags: string[];
}

export const empresas: Empresa[] = [
  {
    slug: "kilo-grill-comercio-de-alimentos",
    nome: "Kilo Grill Comércio de Alimentos",
    categoria: "Restaurantes",
    descricao:
      "Restaurante self-service com grelhados, buffet variado e opções veganas. Atendimento no almoço de segunda a sábado, com delivery na região.",
    endereco: "R. Fagundes Varela, 1954",
    bairro: "Jardim Social",
    cidade: "Curitiba",
    uf: "PR",
    cep: "82520-040",
    telefone: "(41) 3362-4410",
    whatsapp: "(41) 99812-4410",
    site: "kilogrill.com.br",
    email: "contato@kilogrill.com.br",
    horario: "Seg a Sáb, 11h às 15h",
    nota: 4.6,
    avaliacoes: 218,
    verificada: true,
    tags: ["Self-service", "Delivery", "Almoço executivo"],
  },
  {
    slug: "killtec-calcados",
    nome: "Killtec Calçados",
    categoria: "Calçados",
    descricao:
      "Importação e distribuição de calçados esportivos e casuais para varejo e atacado, com pronta entrega para todo o Brasil.",
    endereco: "R. Mal. Deodoro, 261 — lj 2",
    bairro: "Centro",
    cidade: "Curitiba",
    uf: "PR",
    cep: "80012-970",
    telefone: "(41) 3223-7788",
    whatsapp: "(41) 99745-7788",
    site: "killtec.com.br",
    email: "vendas@killtec.com.br",
    horario: "Seg a Sex, 9h às 18h",
    nota: 4.2,
    avaliacoes: 96,
    verificada: true,
    tags: ["Atacado", "Varejo", "Envio nacional"],
  },
  {
    slug: "kilimpo-produtos-de-limpeza",
    nome: "Kilimpo Produtos de Limpeza",
    categoria: "Produtos p/ Limpeza",
    descricao:
      "Distribuidora de produtos de limpeza profissional, descartáveis e equipamentos para condomínios, escolas e empresas.",
    endereco: "Av. São José, 1084 — lj 1",
    bairro: "Cristo Rei",
    cidade: "Curitiba",
    uf: "PR",
    cep: "80050-350",
    telefone: "(41) 3363-9021",
    email: "comercial@kilimpo.com.br",
    horario: "Seg a Sex, 8h às 18h",
    nota: 4.8,
    avaliacoes: 143,
    verificada: true,
    tags: ["Distribuidora", "Higienização", "B2B"],
  },
  {
    slug: "kika-ferragens",
    nome: "Kika Ferragens",
    categoria: "Ferramentas",
    descricao:
      "Loja de ferragens, ferramentas elétricas e materiais para construção com orçamento rápido e entrega no mesmo dia.",
    endereco: "R. José Carlos de Macedo Soares, 470",
    bairro: "Xaxim",
    cidade: "Curitiba",
    uf: "PR",
    cep: "81810-260",
    telefone: "(41) 3276-5533",
    whatsapp: "(41) 99630-5533",
    horario: "Seg a Sex, 8h às 18h · Sáb, 8h às 12h",
    nota: 4.4,
    avaliacoes: 74,
    verificada: false,
    tags: ["Ferramentas", "Construção", "Entrega rápida"],
  },
  {
    slug: "kicar-comercio-de-veiculos",
    nome: "Kicar Comércio de Veículos",
    categoria: "Concessionárias",
    descricao:
      "Revenda de veículos seminovos com garantia, financiamento próprio e avaliação do seu carro na troca.",
    endereco: "Av. Ver. Toaldo Túlio, 4638",
    bairro: "São Braz",
    cidade: "Curitiba",
    uf: "PR",
    cep: "82300-332",
    telefone: "(41) 3372-1100",
    whatsapp: "(41) 99120-1100",
    site: "kicarveiculos.com.br",
    horario: "Seg a Sex, 9h às 19h · Sáb, 9h às 14h",
    nota: 4.1,
    avaliacoes: 312,
    verificada: true,
    tags: ["Seminovos", "Financiamento", "Troca"],
  },
  {
    slug: "ki-show-brinquedos",
    nome: "Ki Show Brinquedos",
    categoria: "Brinquedos",
    descricao:
      "Loja de brinquedos educativos, jogos e artigos para festas infantis com atendimento personalizado.",
    endereco: "R. Salvador Ferrante, 184",
    bairro: "Boqueirão",
    cidade: "Curitiba",
    uf: "PR",
    cep: "81650-230",
    telefone: "(41) 3286-4477",
    horario: "Seg a Sáb, 9h às 19h",
    nota: 4.7,
    avaliacoes: 58,
    verificada: false,
    tags: ["Brinquedos", "Festas", "Educativos"],
  },
  {
    slug: "kilgus-confeccoes",
    nome: "Kilgus Confecções",
    categoria: "Roupas Unissex",
    descricao:
      "Confecção de uniformes profissionais e roupas unissex sob medida, com produção própria e personalização.",
    endereco: "Av. Manoel Ribas, 8610",
    bairro: "Santa Felicidade",
    cidade: "Curitiba",
    uf: "PR",
    cep: "82400-000",
    telefone: "(41) 3372-8899",
    email: "atendimento@kilgus.com.br",
    horario: "Seg a Sex, 8h30 às 18h",
    nota: 4.3,
    avaliacoes: 41,
    verificada: false,
    tags: ["Uniformes", "Sob medida", "Personalização"],
  },
  {
    slug: "kikijuh-confeccoes",
    nome: "Kikijuh Indústria de Roupas",
    categoria: "Confecções",
    descricao:
      "Indústria de confecções unissex para atacado e fabricação de coleções para marcas próprias.",
    endereco: "R. Pe. Germano Mayer, 1761",
    bairro: "Hugo Lange",
    cidade: "Curitiba",
    uf: "PR",
    cep: "80040-170",
    telefone: "(41) 3264-1212",
    horario: "Seg a Sex, 8h às 17h",
    nota: 4.0,
    avaliacoes: 27,
    verificada: false,
    tags: ["Atacado", "Marca própria", "Indústria"],
  },
];

export function getEmpresa(slug: string) {
  return empresas.find((e) => e.slug === slug);
}
