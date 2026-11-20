import { getPortfolioData } from "@/lib/db";
import { AboutSection } from "@/components/AboutSection";
import { SectionLayout } from "@/components/SectionLayout";

export default async function SobrePage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/inicio">
      <AboutSection profile={data.profile} />
    </SectionLayout>
  );
}
