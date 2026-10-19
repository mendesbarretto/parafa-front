const apiBaseUrl = () => typeof window === 'undefined'
  ? (process.env.API_URL || 'http://localhost:8000/api')
  : '/api/backend';

const apiHeaders = (): HeadersInit => ({
  Accept: 'application/json',
  ...(typeof window === 'undefined' && process.env.INTERNAL_API_KEY
    ? { 'X-API-Key': process.env.INTERNAL_API_KEY } : {}),
});

export class ApiNotFoundError extends Error {}

function assertApiResponse(response: Response, resource: string): void {
  if (response.status === 404) throw new ApiNotFoundError(`${resource} não encontrado`);
  if (!response.ok) throw new Error(`Failed to fetch ${resource}: HTTP ${response.status}`);
}

export interface EmpresaPhone {
  type: number;
  ddd: string;
  phone: string;
  display: string;
  tel: string;
  whatsapp_url?: string | null;
}

export interface Empresa {
  id: string;
  name: string;
  slogan?: string | null;
  description?: string | null;
  title_address?: string | null;
  patent_address?: string | null;
  address: string;
  number?: string | number | null;
  complement?: string | null;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;
  hide_address?: string | null;
  formatted_address?: string | null;
  site?: string | null;
  email?: string | null;
  category_id: number;
  city_id: string;
  url: string;
  status: string;
  category_name?: string;
  category_url?: string;
  department_name?: string;
  department_url?: string;
  phone?: string | null;
  phone_tel?: string | null;
  whatsapp?: string | null;
  whatsapp_url?: string | null;
  phones?: EmpresaPhone[];
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  other_cities?: Pick<Cidade, 'id' | 'name' | 'state' | 'url'>[];
}

export interface Categoria {
  id: number;
  name: string;
  url: string;
  department_id: number;
  customers_count: number;
  department_name?: string;
  department_url?: string;
}

export interface Departamento {
  id: number;
  name: string;
  url: string;
  categories_count?: number;
  categories?: Categoria[];
}

export interface Cidade {
  id: string;
  name: string;
  state: string;
  url: string;
  region: string;
  customers_count: number;
  state_name?: string;
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from?: number;
    to?: number;
  };
}

export async function fetchEmpresas(params?: {
  per_page?: number;
  category_id?: number;
  city_id?: string;
  city?: string;
  city_url?: string;
  state?: string;
  department_url?: string;
  include_inactive?: boolean;
  search?: string;
  page?: number;
}, signal?: AbortSignal): Promise<ApiResponse<Empresa>> {
  const queryParams = new URLSearchParams();
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
  if (params?.city_id) queryParams.append('city_id', params.city_id);
  if (params?.city) queryParams.append('city', params.city);
  if (params?.city_url) queryParams.append('city_url', params.city_url);
  if (params?.state) queryParams.append('state', params.state);
  if (params?.department_url) queryParams.append('department_url', params.department_url);
  if (params?.include_inactive) queryParams.append('include_inactive', '1');
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page) queryParams.append('page', params.page.toString());

  const url = `${apiBaseUrl()}/empresas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await fetch(url, { headers: apiHeaders(), signal });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch empresas: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchEmpresasRecentes(): Promise<{ data: Empresa[] }> {
  const response = await fetch(`${apiBaseUrl()}/empresas/recentes`, { headers: apiHeaders() });
  if (!response.ok) throw new Error(`Failed to fetch empresas recentes: ${response.statusText}`);
  return response.json();
}

export async function fetchEmpresa(id: string): Promise<Empresa> {
  const response = await fetch(`${apiBaseUrl()}/empresas/${id}`, { headers: apiHeaders() });
  assertApiResponse(response, 'empresa');
  
  return response.json();
}

export async function fetchCategorias(): Promise<ApiResponse<Categoria>> {
  const response = await fetch(`${apiBaseUrl()}/categorias`, { headers: apiHeaders() });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categorias: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCategoria(id: string): Promise<Categoria> {
  const response = await fetch(`${apiBaseUrl()}/categorias/${id}`, { headers: apiHeaders() });
  assertApiResponse(response, 'categoria');
  
  return response.json();
}

export async function fetchDepartamentos(): Promise<Departamento[]> {
  const response = await fetch(`${apiBaseUrl()}/departamentos`, { headers: apiHeaders() });
  if (!response.ok) throw new Error(`Failed to fetch departamentos: ${response.statusText}`);
  return response.json();
}

export async function fetchDepartamento(slug: string): Promise<Departamento> {
  const response = await fetch(`${apiBaseUrl()}/departamentos/${encodeURIComponent(slug)}`, { headers: apiHeaders() });
  assertApiResponse(response, 'departamento');
  return response.json();
}

export async function fetchCidadePorSlug(state: string, slug: string): Promise<Cidade> {
  const response = await fetch(`${apiBaseUrl()}/cidades/slug/${encodeURIComponent(state)}/${encodeURIComponent(slug)}`, { headers: apiHeaders() });
  assertApiResponse(response, 'cidade');
  return response.json();
}

export async function fetchCidades(state?: string): Promise<Cidade[]> {
  const queryParams = state ? `?state=${state}` : '';
  const response = await fetch(`${apiBaseUrl()}/cidades${queryParams}`, { headers: apiHeaders() });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cidades: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCidade(id: string): Promise<Cidade> {
  const response = await fetch(`${apiBaseUrl()}/cidades/${id}`, { headers: apiHeaders() });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cidade: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchEstados(): Promise<string[]> {
  const response = await fetch(`${apiBaseUrl()}/estados`, { headers: apiHeaders() });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch estados: ${response.statusText}`);
  }
  
  return response.json();
}
