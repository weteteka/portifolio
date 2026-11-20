import { Globe2 } from "lucide-react";
import type { Language } from "@/types/portfolio";

interface LanguagesSectionProps {
  languages: Language[];
}

export function LanguagesSection({ languages }: LanguagesSectionProps) {
  return (
    <section
      id="idiomas"
      className="py-16 sm:py-24 bg-zinc-950 text-white relative border-t border-zinc-900 w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center mb-10 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>COMUNICAÇÃO GLOBAL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Idiomas & Fluência
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base max-w-xl mt-2 px-2">
            Idiomas que utilizo para comunicação técnica, reuniões globais e escrita documental.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="card-motion overflow-hidden p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base sm:text-lg font-bold text-white">{lang.name}</span>
                  <span className="text-[11px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {lang.level}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-4">
                  Capacidade de comunicação técnica, reuniões globais e escrita documental.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-mono">
                  <span>Proficiência</span>
                  <span className="text-cyan-400 font-bold">{lang.percentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
