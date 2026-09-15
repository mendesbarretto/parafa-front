import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { fetchCategorias } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    department: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { department } = await params;
    const departmentFormatted = department.replace(/-/g, ' ');
    
    return {
      title: `${departmentFormatted} | Parafa`,
      description: `Encontre empresas de ${departmentFormatted} em todo o Brasil.`,
      openGraph: {
        title: `${departmentFormatted} | Parafa`,
        description: `Busque empresas de ${departmentFormatted} com telefone, endereço e avaliações.`,
      },
    };
  } catch {
    return {
      title: "Serviços | Parafa",
    };
  }
}

export default async function ServicosDepartmentPage({ params }: PageProps) {
  try {
    const { department } = await params;
    const departmentFormatted = department.replace(/-/g, ' ');
    
    const categoriasData = await fetchCategorias();
    const departmentCategorias = categoriasData.data.filter(
      cat => cat.department_id === parseInt(department.replace('departamento-', ''))
    );

    if (departmentCategorias.length === 0) {
      notFound();
    }

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
                <span className="font-medium text-primary-foreground">{departmentFormatted}</span>
              </nav>

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
                {departmentFormatted}
              </h1>
              <p className="mt-2 text-sm text-primary-foreground/80">
                {departmentCategorias.length} categorias disponíveis
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {departmentCategorias.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/servicos/${department}/${cat.url}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-extrabold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {cat.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-semibold text-card-foreground">
                      {cat.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {cat.customers_count} empresas
                    </span>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>

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
          <p className="text-center text-red-500">Erro ao carregar departamento.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
