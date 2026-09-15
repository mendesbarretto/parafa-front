import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parafa.com.br';
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Parafa Blog</title>
    <description>Dicas, novidades e informações sobre empresas e serviços</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/blog/rss" rel="self" type="application/rss+xml" />
    <language>pt-br</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    
    <item>
      <title>Como escolher o melhor restaurante para seu evento</title>
      <description>Dicas práticas para selecionar o local perfeito para suas celebrações.</description>
      <link>${baseUrl}/blog/como-escolher-melhor-restaurante-evento</link>
      <pubDate>Mon, 10 Sep 2024 00:00:00 GMT</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/como-escolher-melhor-restaurante-evento</guid>
    </item>
    
    <item>
      <title>Guia completo de serviços em Curitiba</title>
      <description>Descubra os melhores profissionais e estabelecimentos da cidade.</description>
      <link>${baseUrl}/blog/guia-completo-servicos-curitiba</link>
      <pubDate>Sat, 08 Sep 2024 00:00:00 GMT</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/guia-completo-servicos-curitiba</guid>
    </item>
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
