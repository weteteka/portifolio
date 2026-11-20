import type { PortfolioData } from "../types/portfolio";

/** Estrutura vazia usada quando ainda não há dados salvos no banco. */
export function createEmptyPortfolioData(
  name = "",
  email = ""
): PortfolioData {
  return {
    profile: {
      name,
      role: "",
      tagline: "",
      aboutMe: "",
      avatarUrl: "",
      email,
      phone: "",
      location: "",
      availability: "",
      yearsOfExperience: 0,
      projectsCompleted: 0,
      happyClients: 0,
      resumeUrl: "",
    },
    skills: [],
    strengths: [],
    languages: [],
    tools: [],
    recommendations: [],
    projects: [],
    experiences: [],
    socials: [],
  };
}
