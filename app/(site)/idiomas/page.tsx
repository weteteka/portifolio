import { getPortfolioData } from "@/lib/db";
import { LanguagesSection } from "@/components/LanguagesSection";
import { SectionLayout } from "@/components/SectionLayout";

export default async function IdiomasPage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/idiomas">
      <LanguagesSection languages={data.languages} />
    </SectionLayout>
  );
}
