import { SectionNav } from "./SectionNav";

interface SectionLayoutProps {
  currentHref: string;
  children: React.ReactNode;
}

export function SectionLayout({ currentHref, children }: SectionLayoutProps) {
  return (
    <div className="pt-20 sm:pt-24">
      {children}
      <SectionNav currentHref={currentHref} />
    </div>
  );
}
