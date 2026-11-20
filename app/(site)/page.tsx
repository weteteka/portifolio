import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { getPortfolioData } from "@/lib/db";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { DynamicIcon } from "@/components/DynamicIcon";
import { siteNavLinks } from "@/lib/site-nav";
import { SectionLayout } from "@/components/SectionLayout";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <SectionLayout currentHref="/inicio">
      <AboutSection profile={data.profile} />
    </SectionLayout>
  );
}
