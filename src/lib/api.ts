const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://api.parafa.com.br/api' 
    : 'http://localhost:8000/api');

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
}

const DEFAULT_HEADERS: Record<string, string> = {
  'Accept': 'application/json',
  'X-API-Key': process.env.INTERNAL_API_KEY || 'parafa_api_2024_secure_key',
};

export interface Categoria {
  id: number;
  name: string;
  url: string;
  department_id: number;
  customers_count: number;
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
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
}

export async function fetchEmpresas(params?: {
  per_page?: number;
  category_id?: number;
  city_id?: string;
  state?: string;
  search?: string;
}): Promise<ApiResponse<Empresa>> {
  const queryParams = new URLSearchParams();
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
  if (params?.city_id) queryParams.append('city_id', params.city_id);
  if (params?.state) queryParams.append('state', params.state);
  if (params?.search) queryParams.append('search', params.search);

  const url = `${API_BASE_URL}/empresas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await fetch(url, { headers: DEFAULT_HEADERS });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch empresas: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchEmpresa(id: string): Promise<Empresa> {
  const response = await fetch(`${API_BASE_URL}/empresas/${id}`, { headers: DEFAULT_HEADERS });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch empresa: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCategorias(): Promise<ApiResponse<Categoria>> {
  const response = await fetch(`${API_BASE_URL}/categorias`, { headers: DEFAULT_HEADERS });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categorias: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCategoria(id: string): Promise<Categoria> {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, { headers: DEFAULT_HEADERS });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categoria: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCidades(state?: string): Promise<Cidade[]> {
  const queryParams = state ? `?state=${state}` : '';
  const response = await fetch(`${API_BASE_URL}/cidades${queryParams}`, { headers: DEFAULT_HEADERS });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cidades: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCidade(id: string): Promise<Cidade> {
  const response = await fetch(`${API_BASE_URL}/cidades/${id}`, { headers: DEFAULT_HEADERS });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cidade: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchEstados(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/estados`, { headers: DEFAULT_HEADERS });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch estados: ${response.statusText}`);
  }
  
  return response.json();
}
