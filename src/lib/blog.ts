import 'server-only';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string | null;
  categories: string[] | null;
  meta_description: string | null;
  published_at: string;
  updated_at: string;
}

export interface BlogPage {
  data: BlogPost[];
  current_page: number;
  last_page: number;
  total: number;
}

export async function blogApi<T>(path: string): Promise<T> {
  const base = process.env.API_URL || 'http://localhost:8000/api';
  const response = await fetch(`${base.replace(/\/$/, '')}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(process.env.INTERNAL_API_KEY ? { 'X-API-Key': process.env.INTERNAL_API_KEY } : {}),
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`API ${response.status}: ${path}`);
  return response.json();
}

export const blogDate = (date: string) => new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
