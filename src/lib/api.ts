const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://api.parafa.com.br/api' 
    : 'http://localhost:8000/api');

export interface Empresa {
  id: string;
  name: string;
  slogan?: string;
  description: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;
  site?: string;
  email?: string;
  category_id: number;
  city_id: string;
  url: string;
  status: string;
  category_name?: string;
}

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
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch empresas: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchEmpresa(id: string): Promise<Empresa> {
  const response = await fetch(`${API_BASE_URL}/empresas/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch empresa: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCategorias(): Promise<ApiResponse<Categoria>> {
  const response = await fetch(`${API_BASE_URL}/categorias`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categorias: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCategoria(id: string): Promise<Categoria> {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categoria: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCidades(state?: string): Promise<Cidade[]> {
  const queryParams = state ? `?state=${state}` : '';
  const response = await fetch(`${API_BASE_URL}/cidades${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cidades: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCidade(id: string): Promise<Cidade> {
  const response = await fetch(`${API_BASE_URL}/cidades/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cidade: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchEstados(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/estados`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch estados: ${response.statusText}`);
  }
  
  return response.json();
}
