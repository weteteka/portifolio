import { getPortfolioData } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { StrengthsSection } from "@/components/StrengthsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ToolsSection } from "@/components/ToolsSection";
import { ExperiencesSection } from "@/components/ExperiencesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { ContactSection } from "@/components/ContactSection";

export const instant = false;

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-white w-full overflow-x-hidden">
      {/* Navigation */}
      <Navbar name={data.profile.name} role={data.profile.role} />

      {/* Main Sections */}
      <main className="flex-1 flex flex-col w-full overflow-x-hidden">
        {/* Hero Section */}
        <Hero profile={data.profile} socials={data.socials} />

        {/* Sobre Mim */}
        <AboutSection profile={data.profile} />

        {/* Potencialidades / Soft Skills */}
        <StrengthsSection strengths={data.strengths} />

        {/* Habilidades & Idiomas */}
        <SkillsSection skills={data.skills} languages={data.languages} />

        {/* Ferramentas */}
        <ToolsSection tools={data.tools} />

        {/* Meus Projetos */}
        <ProjectsSection projects={data.projects} />

        {/* Empresas Onde Já Trabalhei */}
        <ExperiencesSection experiences={data.experiences} />

        {/* Recomendações */}
        <RecommendationsSection recommendations={data.recommendations} />

        {/* Contato & Redes Sociais */}
        <ContactSection profile={data.profile} socials={data.socials} />
      </main>
    </div>
  );
}
