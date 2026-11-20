import { getPortfolioData } from "@/lib/db";
import { ToolsSection } from "@/components/ToolsSection";
import { SectionLayout } from "@/components/SectionLayout";

export default async function FerramentasPage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/ferramentas">
      <ToolsSection tools={data.tools} skills={data.skills} />
    </SectionLayout>
  );
}
