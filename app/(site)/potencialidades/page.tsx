import { getPortfolioData } from "@/lib/db";
import { StrengthsSection } from "@/components/StrengthsSection";
import { SectionLayout } from "@/components/SectionLayout";

export default async function PotencialidadesPage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/potencialidades">
      <StrengthsSection strengths={data.strengths} />
    </SectionLayout>
  );
}
