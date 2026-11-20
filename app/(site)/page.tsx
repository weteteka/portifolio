import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { getPortfolioData } from "@/lib/db";
import { Hero } from "@/components/Hero";
import { siteNavLinks } from "@/lib/site-nav";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <Hero profile={data.profile} socials={data.socials} />

      <section className="w-full bg-zinc-950 border-t border-zinc-900 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <Layers3 className="w-3.5 h-3.5" />
              <span>NAVEGUE PELO PORTFÓLIO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Escolha uma seção
            </h2>
            <p className="text-sm text-zinc-400 mt-3 max-w-2xl">
              Cada assunto tem sua própria página para facilitar a navegação e o acesso direto ao conteúdo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {siteNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col justify-between gap-4 p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all hover:-translate-y-0.5"
              >
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{link.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
