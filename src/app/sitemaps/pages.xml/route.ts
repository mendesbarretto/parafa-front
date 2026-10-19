import { blogApi } from '@/lib/blog';
import { urlSet, xmlResponse } from '@/lib/xml';

export const dynamic = 'force-dynamic';

const states = [
  'acre', 'alagoas', 'amapa', 'amazonas', 'bahia', 'ceara', 'distrito-federal',
  'espirito-santo', 'goias', 'maranhao', 'mato-grosso', 'mato-grosso-do-sul',
  'minas-gerais', 'para', 'paraiba', 'parana', 'pernambuco', 'piaui',
  'rio-de-janeiro', 'rio-grande-do-norte', 'rio-grande-do-sul', 'rondonia',
  'roraima', 'santa-catarina', 'sao-paulo', 'sergipe', 'tocantins',
];

export async function GET() {
  try {
    const { data } = await blogApi<{ data: string[] }>('/sitemaps/pages');
    const paths = [...data, ...states.map(state => `/${state}`)];
    return xmlResponse(urlSet(paths.filter(path => /^\/[a-z0-9/-]*$/.test(path)).map(path => ({ path }))));
  } catch { return new Response('Sitemap indisponível', { status: 503 }); }
}
