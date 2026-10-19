import { GET as sitemapIndex } from '@/app/sitemap.xml/route';

export const dynamic = 'force-dynamic';
export async function GET() { return sitemapIndex(); }
