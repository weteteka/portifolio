"use client";

import React from "react";
import { Strength } from "@/types/portfolio";
import { DynamicIcon } from "./DynamicIcon";
import { Sparkles } from "lucide-react";

interface StrengthsSectionProps {
  strengths: Strength[];
}

export function StrengthsSection({ strengths }: StrengthsSectionProps) {
  return (
    <section id="potencialidades" className="py-16 sm:py-24 bg-zinc-900/60 text-white relative w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DIFERENCIAIS & SOFT SKILLS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Minhas Potencialidades
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base max-w-xl mt-2 px-2">
            Competências estratégicas, metodologias e valores que levo para cada equipe e produto.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {strengths.map((item) => (
            <div
              key={item.id}
              className="card-motion group p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all"></div>

              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-zinc-950 transition-all">
                <DynamicIcon name={item.icon || "Sparkles"} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-zinc-100 mb-2 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
