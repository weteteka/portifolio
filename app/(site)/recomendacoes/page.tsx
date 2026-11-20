import { getPortfolioData } from "@/lib/db";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { SectionLayout } from "@/components/SectionLayout";

export default async function RecomendacoesPage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/recomendacoes">
      <RecommendationsSection recommendations={data.recommendations} />
    </SectionLayout>
  );
}
