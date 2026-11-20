import { getPortfolioData } from "@/lib/db";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SectionLayout } from "@/components/SectionLayout";

export default async function ProjetosPage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/projetos">
      <ProjectsSection projects={data.projects} />
    </SectionLayout>
  );
}
