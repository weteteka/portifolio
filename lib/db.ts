import { defaultPortfolioData } from "./default-data";
import { Prisma } from "./generated/prisma";
import { prisma } from "./prisma";
import type {
  Experience,
  PortfolioData,
  Project,
  Skill,
  Tool,
} from "../types/portfolio";

export { defaultPortfolioData };

const PROFILE_ID = "profile-main";

type PortfolioTx = Prisma.TransactionClient;

export async function getPortfolioData(): Promise<PortfolioData> {
  const profile = await prisma.profile.findUnique({
    where: { id: PROFILE_ID },
  });

  if (!profile) {
    await savePortfolioData(defaultPortfolioData);
    return defaultPortfolioData;
  }

  const [
    skills,
    strengths,
    languages,
    tools,
    recommendations,
    projects,
    experiences,
    socials,
  ] = await Promise.all([
    prisma.skill.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.strength.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.language.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.tool.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.recommendation.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.project.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.experience.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.socialLink.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return {
    profile: {
      name: profile.name,
      role: profile.role,
      tagline: profile.tagline,
      aboutMe: profile.aboutMe,
      avatarUrl: profile.avatarUrl,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      availability: profile.availability,
      yearsOfExperience: profile.yearsOfExperience,
      projectsCompleted: profile.projectsCompleted,
      happyClients: profile.happyClients,
      resumeUrl: profile.resumeUrl,
    },
    skills: skills.map(
      (skill) =>
        ({
          id: skill.id,
          name: skill.name,
          category: skill.category as Skill["category"],
          level: skill.level,
          highlight: skill.highlight,
        }) satisfies Skill
    ),
    strengths: strengths.map((strength) => ({
      id: strength.id,
      title: strength.title,
      description: strength.description,
      icon: strength.icon,
    })),
    languages: languages.map((language) => ({
      id: language.id,
      name: language.name,
      level: language.level,
      percentage: language.percentage,
    })),
    tools: tools.map(
      (tool) =>
        ({
          id: tool.id,
          name: tool.name,
          category: tool.category as Tool["category"],
          iconName: tool.iconName ?? undefined,
        }) satisfies Tool
    ),
    recommendations: recommendations.map((recommendation) => ({
      id: recommendation.id,
      author: recommendation.author,
      role: recommendation.role,
      company: recommendation.company,
      avatarUrl: recommendation.avatarUrl,
      content: recommendation.content,
      relationship: recommendation.relationship,
      linkedinUrl: recommendation.linkedinUrl ?? undefined,
    })),
    projects: projects.map(
      (project) =>
        ({
          id: project.id,
          title: project.title,
          description: project.description,
          longDescription: project.longDescription ?? undefined,
          imageUrl: project.imageUrl,
          tags: project.tags,
          liveUrl: project.liveUrl ?? undefined,
          githubUrl: project.githubUrl ?? undefined,
          featured: project.featured,
          category: project.category as Project["category"],
        }) satisfies Project
    ),
    experiences: experiences.map(
      (experience) =>
        ({
          id: experience.id,
          company: experience.company,
          role: experience.role,
          period: experience.period,
          location: experience.location,
          description: experience.description,
          achievements: experience.achievements,
          technologies: experience.technologies,
          companyUrl: experience.companyUrl ?? undefined,
          logoUrl: experience.logoUrl ?? undefined,
        }) satisfies Experience
    ),
    socials: socials.map((social) => ({
      id: social.id,
      platform: social.platform,
      url: social.url,
      icon: social.icon,
    })),
  };
}

async function replacePortfolioData(tx: PortfolioTx, data: PortfolioData) {
  await tx.profile.upsert({
    where: { id: PROFILE_ID },
    create: { id: PROFILE_ID, ...data.profile },
    update: { ...data.profile },
  });

  await Promise.all([
    tx.skill.deleteMany(),
    tx.strength.deleteMany(),
    tx.language.deleteMany(),
    tx.tool.deleteMany(),
    tx.recommendation.deleteMany(),
    tx.project.deleteMany(),
    tx.experience.deleteMany(),
    tx.socialLink.deleteMany(),
  ]);

  await Promise.all([
    tx.skill.createMany({
      data: data.skills.map((skill) => ({ ...skill, category: skill.category })),
    }),
    tx.strength.createMany({ data: data.strengths }),
    tx.language.createMany({ data: data.languages }),
    tx.tool.createMany({ data: data.tools }),
    tx.recommendation.createMany({ data: data.recommendations }),
    tx.project.createMany({ data: data.projects }),
    tx.experience.createMany({ data: data.experiences }),
    tx.socialLink.createMany({ data: data.socials }),
  ]);
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  await prisma.$transaction((tx) => replacePortfolioData(tx, data));
}
