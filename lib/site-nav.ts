export interface SiteNavLink {
  label: string;
  href: string;
  description: string;
  icon: string;
}

export const siteNavLinks: SiteNavLink[] = [
  {
    label: "Inicio",
    href: "/inicio",
    description: "Minha história, trajetória e informações de contato.",
    icon: "Users",
  },
  {
    label: "Potencialidades",
    href: "/potencialidades",
    description: "Pontos fortes e competências comportamentais.",
    icon: "Zap",
  },
  {
    label: "Habilidades",
    href: "/habilidades",
    description: "Conhecimentos técnicos e competências.",
    icon: "Code",
  },
  {
    label: "Idiomas",
    href: "/idiomas",
    description: "Idiomas e níveis de fluência.",
    icon: "Globe",
  },
  {
    label: "Ferramentas",
    href: "/ferramentas",
    description: "Tecnologias e ferramentas que utilizo no dia a dia.",
    icon: "Terminal",
  },
  {
    label: "Projetos",
    href: "/projetos",
    description: "Trabalhos e projetos desenvolvidos.",
    icon: "Rocket",
  },
  {
    label: "Empresas",
    href: "/empresas",
    description: "Experiências profissionais e empresas onde atuei.",
    icon: "Briefcase",
  },
  {
    label: "Recomendações",
    href: "/recomendacoes",
    description: "Depoimentos de colegas, gestores e clientes.",
    icon: "Quote",
  },
  {
    label: "Contato",
    href: "/contato",
    description: "Vamos conversar sobre o próximo projeto.",
    icon: "Send",
  },
];
