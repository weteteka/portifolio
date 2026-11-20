/**
 * Single source of truth for portfolio categories. Used by the public filters
 * and by the admin create/edit modals so they can never drift apart again.
 */
export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Fullstack",
  "DevOps & Cloud",
  "Mobile & Outros",
  "UI/UX & Design",
  "Design & Prototipagem",
  "Prototipagem",
  "Banco de Dados",
  "Testes & Qualidade",
  "Ferramentas & Utilitários",
  "Linguagens de Programação",
  "Frameworks & Bibliotecas",
  "Outros",
] as const;

export const TOOL_CATEGORIES = [
  "Desenvolvimento",
  "DevOps & Cloud",
  "Design & Prototipagem",
  "Produtividade",
  "Comunicação",
  "Colaboração",
  "Banco de Dados",
  "Testes & Qualidade",
  "Ferramentas & Utilitários",
  "Outros",
] as const;

export const PROJECT_CATEGORIES = ["Full Stack", "Frontend", "Backend", "Mobile"] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type ToolCategory = (typeof TOOL_CATEGORIES)[number];
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
