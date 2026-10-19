import { NextRequest, NextResponse } from 'next/server';

const recentTtlMs = 5 * 60 * 1000;
const recentMaxStaleMs = 60 * 60 * 1000;
const rateWindowMs = 60 * 1000;
const maxTrackedClients = 4096;
const allowedCompanyParams = new Set(['per_page', 'page', 'search', 'city', 'state', 'category_id']);

let recentCache: { body: string; cachedAt: number } | null = null;
let recentRefresh: Promise<void> | null = null;
const rateWindows = new Map<string, { count: number; resetAt: number }>();

function rateLimit(request: NextRequest, maxRequests: number): number | null {
  // Apache acrescenta o IP do visitante ao fim de X-Forwarded-For.
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',').at(-1)?.trim() || 'unknown';
  const key = `${ip}:${maxRequests}`;
  const now = Date.now();
  const current = rateWindows.get(key);

  if (!current || current.resetAt <= now) {
    rateWindows.delete(key);
    rateWindows.set(key, { count: 1, resetAt: now + rateWindowMs });
    if (rateWindows.size > maxTrackedClients) {
      for (const [entryKey, entry] of rateWindows) {
        if (entry.resetAt <= now) rateWindows.delete(entryKey);
      }
      if (rateWindows.size > maxTrackedClients) rateWindows.delete(rateWindows.keys().next().value!);
    }
    return null;
  }

  current.count += 1;
  return current.count > maxRequests ? Math.ceil((current.resetAt - now) / 1000) : null;
}

function reject(status: number, error: string, retryAfter?: number): NextResponse {
  return NextResponse.json({ error }, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {}),
    },
  });
}

function refreshRecent(target: string): Promise<void> {
  if (!recentRefresh) {
    recentRefresh = fetch(target, {
      headers: {
        Accept: 'application/json',
        ...(process.env.INTERNAL_API_KEY ? { 'X-API-Key': process.env.INTERNAL_API_KEY } : {}),
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(60000),
    }).then(async (upstream) => {
      if (!upstream.ok) throw new Error(`Recent companies API returned ${upstream.status}`);
      recentCache = { body: await upstream.text(), cachedAt: Date.now() };
    }).finally(() => {
      recentRefresh = null;
    });
  }
  return recentRefresh;
}

function recentResponse(): NextResponse {
  return new NextResponse(recentCache!.body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=300',
    },
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const isCompanies = path.length === 1 && path[0] === 'empresas';
  const isRecent = path.length === 2 && path[0] === 'empresas' && path[1] === 'recentes';
  const isCategories = path.length === 1 && path[0] === 'categorias';
  if (!isCompanies && !isRecent && !isCategories) {
    return new NextResponse(null, { status: 404 });
  }

  const retryAfter = rateLimit(request, isCompanies ? 30 : 120);
  if (retryAfter !== null) return reject(429, 'Muitas requisições', retryAfter);

  const params = request.nextUrl.searchParams;
  if (isCompanies) {
    const keys = [...params.keys()];
    if (keys.some((key) => !allowedCompanyParams.has(key)) || new Set(keys).size !== keys.length) {
      return reject(400, 'Filtro não disponível na API pública');
    }
    const pageValue = params.get('page') || '1';
    const perPageValue = params.get('per_page') || '20';
    const page = Number(pageValue);
    const perPage = Number(perPageValue);
    if (!/^\d+$/.test(pageValue) || !/^\d+$/.test(perPageValue) ||
        page < 1 || page > 100 || perPage < 1 || perPage > 20) {
      return reject(422, 'Limite de paginação excedido');
    }
    if ((params.get('search')?.length || 0) > 100 ||
        (params.get('city')?.length || 0) > 100 ||
        (params.get('state')?.length || 0) > 2 ||
        (params.get('category_id')?.length || 0) > 10) {
      return reject(422, 'Filtro muito longo');
    }
  } else if (request.nextUrl.search) {
    return reject(400, 'Parâmetros não disponíveis nesta rota');
  }

  const upstreamParams = new URLSearchParams(params);
  if (isCompanies) upstreamParams.set('include_inactive', '1');
  if (isCompanies && params.has('search')) {
    // Nomes publicados como "Sra. Flores" também devem casar com "sra flores".
    const words = params.get('search')!.match(/[\p{L}\p{N}]+/gu);
    if (!words?.length) return reject(400, 'Busca inválida');
    upstreamParams.set('search', words.join('%'));
  }

  const base = process.env.API_URL || 'http://localhost:8000/api';
  const query = upstreamParams.toString();
  const apiBase = base.replace(/\/$/, '');
  const target = isRecent
    ? `${apiBase}/empresas?per_page=12&include_inactive=1`
    : `${apiBase}/${path.map(encodeURIComponent).join('/')}${query ? `?${query}` : ''}`;
  try {
    if (isRecent) {
      const cacheAge = recentCache ? Date.now() - recentCache.cachedAt : Infinity;
      if (cacheAge < recentMaxStaleMs) {
        if (cacheAge >= recentTtlMs) void refreshRecent(target).catch(() => {});
        return recentResponse();
      }
      await refreshRecent(target);
      return recentResponse();
    }

    const upstream = await fetch(target, {
      headers: {
        Accept: 'application/json',
        ...(process.env.INTERNAL_API_KEY ? { 'X-API-Key': process.env.INTERNAL_API_KEY } : {}),
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(60000),
    });
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'API indisponível' }, { status: 502 });
  }
}
