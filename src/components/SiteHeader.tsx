import Link from "next/link";
import { MapPin } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="size-4" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-primary-deep">parafa</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground sm:gap-3 md:gap-7">
          <Link
            href="/empresas"
            prefetch={false}
            className="hidden transition-colors hover:text-primary md:block"
          >
            Empresas
          </Link>
          <Link
            href="/categorias"
            prefetch={false}
            className="hidden transition-colors hover:text-primary md:block"
          >
            Categorias
          </Link>
          <Link
            href="/estados"
            prefetch={false}
            className="hidden transition-colors hover:text-primary md:block"
          >
            Estados
          </Link>
          <Link href="/blog" className="transition-colors hover:text-primary">
            Blog
          </Link>
          <Link href="/contato" className="transition-colors hover:text-primary">
            Contato
          </Link>
        </nav>
        <Link
          href="/anuncie"
          className="shrink-0 whitespace-nowrap rounded-full bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 sm:px-4"
        >
          <span className="sm:hidden">Anuncie</span>
          <span className="hidden sm:inline">Cadastro de empresas</span>
        </Link>
      </div>
    </header>
  );
}
