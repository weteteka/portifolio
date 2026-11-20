import { getPortfolioData } from "@/lib/db";
import { ExperiencesSection } from "@/components/ExperiencesSection";
import { SectionLayout } from "@/components/SectionLayout";

export default async function EmpresasPage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/empresas">
      <ExperiencesSection experiences={data.experiences} />
    </SectionLayout>
  );
}
