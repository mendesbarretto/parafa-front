import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 10000) return NextResponse.json({ message: 'Solicitação muito longa.' }, { status: 413 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${(process.env.API_URL || 'http://localhost:8000/api').replace(/\/$/, '')}/empresas/solicitacoes`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(process.env.INTERNAL_API_KEY ? { 'X-API-Key': process.env.INTERNAL_API_KEY } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    const result = await upstream.json();
    return NextResponse.json(result, { status: upstream.status, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ message: 'Não foi possível enviar agora. Tente novamente.' }, { status: 502 });
  }
}
