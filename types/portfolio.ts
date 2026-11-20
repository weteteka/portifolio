export interface Profile {
  name: string;
  role: string;
  tagline: string;
  aboutMe: string;
  avatarUrl: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  happyClients: number;
  resumeUrl: string;
}

export interface Skill {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "DevOps & Cloud" | "Mobile & Outros" | "UI/UX & Design" | "Design & Prototipagem" | "Banco de Dados" | "Testes & Qualidade" | "Ferramentas & Utilitários" | "Linguagens de Programação" | "Frameworks & Bibliotecas" | "Outros";
  level: number; // 0 to 100
  highlight: boolean;
}

export interface Strength {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface Language {
  id: string;
  name: string;
  level: string; // e.g., "Nativo", "Fluente (C2)", "Avançado", "Intermediário"
  percentage: number;
}

export interface Tool {
  id: string;
  name: string;
  category: "Desenvolvimento" | "DevOps & Cloud" | "Design & Prototipagem" | "Produtividade" | "Comunicação" | "Colaboração" | "Banco de Dados" | "Testes & Qualidade" | "Ferramentas & Utilitários" | "Outros";
  iconName?: string;
}

export interface Recommendation {
  id: string;
  author: string;
  role: string;
  company: string;
  avatarUrl: string;
  content: string;
  relationship: string;
  linkedinUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: "Full Stack" | "Frontend" | "Backend" | "Mobile";
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  companyUrl?: string;
  logoUrl?: string;
}

export interface SocialLink {
  id: string;
  platform: string; // "GitHub" | "LinkedIn" | "Twitter" | "Instagram" | "WhatsApp" | "YouTube" | "Outro"
  url: string;
  icon: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  strengths: Strength[];
  languages: Language[];
  tools: Tool[];
  recommendations: Recommendation[];
  projects: Project[];
  experiences: Experience[];
  socials: SocialLink[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}
