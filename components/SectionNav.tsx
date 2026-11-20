import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { siteNavLinks } from "@/lib/site-nav";

interface SectionNavProps {
  currentHref: string;
}

export function SectionNav({ currentHref }: SectionNavProps) {
  const index = siteNavLinks.findIndex((link) => link.href === currentHref);
  const previous = index > 0 ? siteNavLinks[index - 1] : null;
  const next = index >= 0 && index < siteNavLinks.length - 1 ? siteNavLinks[index + 1] : null;

  return (
    <nav
      aria-label="Navegação entre seções"
      className="w-full border-t border-zinc-900 bg-zinc-950 px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch justify-between gap-3">
        {previous ? (
          <Link
            href={previous.href}
            className="group flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>
              <span className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500">Anterior</span>
              {previous.label}
            </span>
          </Link>
        ) : (
          <Link
            href="/"
            className="group flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
            Início
          </Link>
        )}

        {next && (
          <Link
            href={next.href}
            className="group flex items-center justify-center sm:justify-end gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <span className="sm:text-right">
              <span className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500">Próxima</span>
              {next.label}
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </nav>
  );
}
