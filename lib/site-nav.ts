export interface SiteNavLink {
  label: string;
  href: string;
  description: string;
}

export const siteNavLinks: SiteNavLink[] = [
  {
    label: "Sobre",
    href: "/sobre",
    description: "Minha história, trajetória e informações de contato.",
  },
  {
    label: "Potencialidades",
    href: "/potencialidades",
    description: "Pontos fortes e competências comportamentais.",
  },
  {
    label: "Habilidades",
    href: "/habilidades",
    description: "Conhecimentos técnicos e idiomas.",
  },
  {
    label: "Ferramentas",
    href: "/ferramentas",
    description: "Tecnologias e ferramentas que utilizo no dia a dia.",
  },
  {
    label: "Projetos",
    href: "/projetos",
    description: "Trabalhos e projetos desenvolvidos.",
  },
  {
    label: "Empresas",
    href: "/empresas",
    description: "Experiências profissionais e empresas onde atuei.",
  },
  {
    label: "Recomendações",
    href: "/recomendacoes",
    description: "Depoimentos de colegas, gestores e clientes.",
  },
  {
    label: "Contato",
    href: "/contato",
    description: "Vamos conversar sobre o próximo projeto.",
  },
];
