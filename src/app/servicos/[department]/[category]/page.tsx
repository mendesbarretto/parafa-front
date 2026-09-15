import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchEmpresas, fetchCategorias } from "@/lib/api";
import { EmpresaCard } from "@/components/EmpresaCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    department: string;
    category: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { department, category } = await params;
    const categoryFormatted = category.replace(/-/g, ' ');
    
    return {
      title: `${categoryFormatted} | Parafa`,
      description: `Encontre empresas de ${categoryFormatted} em todo o Brasil.`,
      openGraph: {
        title: `${categoryFormatted} | Parafa`,
        description: `Busque empresas de ${categoryFormatted} com telefone, endereço e avaliações.`,
      },
    };
  } catch {
    return {
      title: "Serviços | Parafa",
    };
  }
}

export default async function ServicosDepartmentCategoryPage({ params }: PageProps) {
  try {
    const { department, category } = await params;
    const categoryFormatted = category.replace(/-/g, ' ');
    
    const categoriasData = await fetchCategorias();
    const categoriaEncontrada = categoriasData.data.find(c => c.url === category);
    
    if (!categoriaEncontrada) {
      notFound();
    }
    
    const empresasData = await fetchEmpresas({ category_id: categoriaEncontrada.id, per_page: 20 });

    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <main>
          <section className="hero-surface">
            <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
              <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/70">
                <Link href="/" className="transition-colors hover:text-primary-foreground">
                  Início
                </Link>
                <ArrowRight className="size-3.5" />
                <Link href="/servicos" className="transition-colors hover:text-primary-foreground">
                  Serviços
                </Link>
                <ArrowRight className="size-3.5" />
                <Link href={`/servicos/${department}`} className="transition-colors hover:text-primary-foreground">
                  {department.replace(/-/g, ' ')}
                </Link>
                <ArrowRight className="size-3.5" />
                <span className="font-medium text-primary-foreground">{categoryFormatted}</span>
              </nav>

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                {categoryFormatted}
              </h1>
              <p className="mt-2 text-sm text-primary-foreground/80">
                {empresasData.meta.total} empresas cadastradas
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {empresasData.data.map((empresa) => (
                <EmpresaCard key={empresa.id} empresa={empresa} />
              ))}
            </div>

            {empresasData.data.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="mt-3 font-medium text-foreground">Nenhuma empresa encontrada nesta categoria</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente outra categoria ou volte mais tarde.
                </p>
              </div>
            )}

            <div className="mt-14">
              <AdSlot format="leaderboard" />
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-center text-red-500">Erro ao carregar categoria.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
