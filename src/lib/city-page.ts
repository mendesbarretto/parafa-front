import { notFound } from 'next/navigation';
import { fetchCidadePorSlug } from './api';
import { requiredData } from './page-data';

export async function requireCityFromPath(slug: string) {
  const match = slug.match(/^(.+)-([a-z]{2})$/i);
  if (!match) notFound();
  return requiredData(fetchCidadePorSlug(match[2].toUpperCase(), match[1].toLowerCase()));
}
