interface SectionLayoutProps {
  currentHref?: string;
  children: React.ReactNode;
}

export function SectionLayout({ children }: SectionLayoutProps) {
  return <div className="pt-20 sm:pt-24">{children}</div>;
}
