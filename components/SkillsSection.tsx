"use client";

import React, { useState } from "react";
import { Skill } from "@/types/portfolio";
import { Code2, Star } from "lucide-react";

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  const categories = [
    "Todas",
    "Frontend",
    "Backend",
    "Fullstack",
    "DevOps & Cloud",
    "Mobile & Outros",
    "UI/UX & Design",
    "Prototipagem",
    "Banco de Dados",
    "Testes & Qualidade",
    "Ferramentas & Utilitários",
    "Linguagens de Programação",
    "Frameworks & Bibliotecas",
    "Outros",
  ];

  const filteredSkills =
    selectedCategory === "Todas"
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="habilidades" className="py-16 sm:py-24 bg-zinc-950 text-white relative border-t border-zinc-900 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-10 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>COMPETÊNCIAS TÉCNICAS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Minhas Habilidades
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base max-w-xl mt-2 px-2">
            Tecnologias centrais que utilizo para transformar requisitos em aplicações robustas.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-3"></div>
        </div>

        {/* Skills Sub-section */}
        <div className="mb-16 sm:mb-20">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold"
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="card-motion overflow-hidden p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/40 transition-all hover:bg-zinc-900/90 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-zinc-100 group-hover:text-emerald-300 transition-colors">
                      {skill.name}
                    </span>
                    {skill.highlight && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Star className="w-2.5 h-2.5 fill-emerald-400" />
                        Destaque
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {skill.level}%
                  </span>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                <div className="mt-2 text-[10px] sm:text-[11px] text-zinc-400 font-mono">
                  Categoria: {skill.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
