import Link from 'next/link';

interface CompanyPaginationProps {
  basePath: string;
  page: number;
  lastPage: number;
}

export function CompanyPagination({ basePath, page, lastPage }: CompanyPaginationProps) {
  if (lastPage <= 1) return null;

  const href = (target: number) => target === 1 ? basePath : `${basePath}?page=${target}`;

  return (
    <nav aria-label="Páginas de empresas" className="mt-8 flex items-center justify-center gap-6 text-sm">
      {page > 1 && <Link href={href(page - 1)} prefetch={false} className="font-semibold text-primary">← Anterior</Link>}
      <span className="text-muted-foreground">Página {page} de {lastPage}</span>
      {page < lastPage && <Link href={href(page + 1)} prefetch={false} className="font-semibold text-primary">Próxima →</Link>}
    </nav>
  );
}
