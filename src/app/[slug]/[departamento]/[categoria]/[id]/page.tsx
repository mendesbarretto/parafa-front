import EmpresaDetailPage, { generateMetadata as generateDetailMetadata } from "./[empresaSlug]/page";

interface PageProps {
  params: Promise<{
    slug: string;
    departamento: string;
    categoria: string;
    id: string;
  }>;
}

function withOptionalSlug(params: PageProps["params"]) {
  return params.then((value) => ({ ...value, empresaSlug: "" }));
}

export async function generateMetadata({ params }: PageProps) {
  return generateDetailMetadata({ params: withOptionalSlug(params) });
}

export default async function EmpresaSemSlugPage({ params }: PageProps) {
  return EmpresaDetailPage({ params: withOptionalSlug(params) });
}
