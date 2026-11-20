import { getPortfolioData } from "@/lib/db";
import { SkillsSection } from "@/components/SkillsSection";
import { SectionLayout } from "@/components/SectionLayout";

export default async function HabilidadesPage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/habilidades">
      <SkillsSection skills={data.skills} />
    </SectionLayout>
  );
}
