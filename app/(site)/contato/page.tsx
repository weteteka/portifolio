import { getPortfolioData } from "@/lib/db";
import { ContactSection } from "@/components/ContactSection";
import { SectionLayout } from "@/components/SectionLayout";

export default async function ContatoPage() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/contato">
      <ContactSection profile={data.profile} socials={data.socials} />
    </SectionLayout>
  );
}
