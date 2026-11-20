import { getPortfolioData } from "@/lib/db";
import { Hero } from "@/components/Hero";
import { SectionLayout } from "@/components/SectionLayout";

export default async function SobrePage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/inicio">
      <Hero profile={data.profile} socials={data.socials} />
    </SectionLayout>
  );
}
