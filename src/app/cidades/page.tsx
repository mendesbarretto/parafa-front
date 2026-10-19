import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AdSlot } from '@/components/AdSlot';
import { fetchCidades, fetchEstados } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/cidades' },
  title: 'Cidades | Parafa',
  description: 'Navegue pelas empresas cadastradas nas cidades do Brasil.',
};
export const dynamic = 'force-dynamic';

const stateNames: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
  PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
  SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};

export default async function CidadesPage({ searchParams }: { searchParams: Promise<{ estado?: string; page?: string }> }) {
  const { estado, page: requestedPage } = await searchParams;
  const uf = estado?.toUpperCase();
  const selectedState = uf && stateNames[uf] ? uf : null;
  const page = Math.max(1, Math.min(1000, Number(requestedPage) || 1));
  const [states, cities] = await Promise.all([
    selectedState ? Promise.resolve([]) : fetchEstados(),
    selectedState ? fetchCidades(selectedState) : Promise.resolve([]),
  ]);
  const pageSize = 120;
  const totalPages = Math.ceil(cities.length / pageSize);
  const visibleCities = selectedState
    ? cities.sort((a, b) => a.name.localeCompare(b.name)).slice((page - 1) * pageSize, page * pageSize)
    : [];

  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="hero-surface"><div className="mx-auto max-w-6xl px-5 py-16">
      {selectedState && <Link href="/cidades" className="text-primary-foreground/80">← Todos os estados</Link>}
      <h1 className="mt-3 text-3xl font-extrabold text-primary-foreground md:text-5xl">
        {selectedState ? `Cidades de ${stateNames[selectedState]}` : 'Cidades'}
      </h1>
      <p className="mt-4 text-primary-foreground/80">
        {selectedState ? 'Escolha uma cidade para encontrar empresas.' : 'Escolha um estado para navegar pelas cidades.'}
      </p>
    </div></section>
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {selectedState ? visibleCities.map(city =>
          <Link key={city.id} href={`/${city.url}-${city.state.toLowerCase()}`} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/30">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-extrabold text-primary">{city.name.charAt(0)}</span>
            <span className="min-w-0 flex-1 truncate font-semibold text-card-foreground">{city.name}</span>
            <span className="text-sm text-muted-foreground">{city.customers_count}</span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>) : states.map(state =>
          <Link key={state} href={`/cidades?estado=${state}`} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 font-semibold text-card-foreground hover:border-primary/30">
            {stateNames[state] || state} <ArrowRight className="size-4 text-muted-foreground" />
          </Link>)}
      </div>
      {selectedState && <nav aria-label="Páginas de cidades" className="mt-8 flex gap-6">
        {page > 1 && <Link href={`/cidades?estado=${selectedState}&page=${page - 1}`} className="text-primary">← Anterior</Link>}
        {page < totalPages && <Link href={`/cidades?estado=${selectedState}&page=${page + 1}`} className="text-primary">Próxima →</Link>}
      </nav>}
    </div>
    <div className="mx-auto max-w-6xl px-5 pb-12"><AdSlot format="leaderboard" /></div>
  </main><SiteFooter /></div>;
}
