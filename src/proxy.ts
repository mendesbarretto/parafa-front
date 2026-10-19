import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const staticRoutes = new Set([
  'api', 'blog', 'busca', 'cidades', 'contato', 'empresas', 'anuncie',
  'servicos', 'sitemaps', 'sitemap', 'sitemap.xml', 'index-sitemap',
  'robots.txt', 'ads.txt', 'favicon.ico', '_next',
]);

const stateSlugs = new Set([
  'acre', 'alagoas', 'amapa', 'amazonas', 'bahia', 'ceara',
  'distrito-federal', 'espirito-santo', 'goias', 'maranhao',
  'mato-grosso', 'mato-grosso-do-sul', 'minas-gerais', 'para',
  'paraiba', 'parana', 'pernambuco', 'piaui', 'rio-de-janeiro',
  'rio-grande-do-norte', 'rio-grande-do-sul', 'rondonia', 'roraima',
  'santa-catarina', 'sao-paulo', 'sergipe', 'tocantins',
]);

const validStates = new Set([
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]);

function notFoundResponse(): Response {
  return new Response(
    '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Página não encontrada | Parafa</title><body style="font:16px system-ui;margin:10vh auto;max-width:40rem;padding:0 1rem;color:#17233f"><h1>Página não encontrada</h1><p>Este endereço não existe no guia Parafa.</p><a href="/">Voltar ao início</a></body></html>',
    { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60' } },
  );
}

export function proxy(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return NextResponse.next();

  const parts = request.nextUrl.pathname.split('/').filter(Boolean);
  if (parts.length === 0 || staticRoutes.has(parts[0])) return NextResponse.next();

  if (parts[0] === 'estados') {
    if (parts.length === 1) return NextResponse.next();
    return parts.length === 2 && validStates.has(parts[1].toUpperCase())
      ? NextResponse.next() : notFoundResponse();
  }

  if (parts[0] === 'categorias') {
    if (parts.length === 1) return NextResponse.next();
    return parts.length === 2 ? NextResponse.next() : notFoundResponse();
  }

  if (parts.length === 1 && stateSlugs.has(parts[0].toLowerCase())) return NextResponse.next();
  const match = parts[0].match(/^([a-z0-9-]+)-([a-z]{2})$/i);
  if (!match || parts.length > 5) return notFoundResponse();

  const state = match[2].toUpperCase();
  if (!validStates.has(state)) return notFoundResponse();

  if (parts.length >= 4 && !/^\d+$/.test(parts[3])) return notFoundResponse();
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
