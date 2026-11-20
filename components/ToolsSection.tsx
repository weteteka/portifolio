"use client";

import React, { useState } from "react";
import { Tool } from "@/types/portfolio";
import { DynamicIcon } from "./DynamicIcon";
import { Wrench } from "lucide-react";

interface ToolsSectionProps {
  tools: Tool[];
}

export function ToolsSection({ tools }: ToolsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  const categories = [
    "Todas",
    "Desenvolvimento",
    "DevOps & Cloud",
    "Design & Prototipagem",
    "Produtividade",
  ];

  const filteredTools =
    selectedCategory === "Todas"
      ? tools
      : tools.filter((t) => t.category === selectedCategory);

  return (
    <section id="ferramentas" className="py-16 sm:py-24 bg-zinc-900/60 text-white relative w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center mb-10 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>ECOSSISTEMA & STACK</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Ferramentas & Tecnologias
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base max-w-xl mt-2 px-2">
            Softwares, editores, plataformas e infraestruturas presentes no meu fluxo de trabalho diário.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mt-3"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                  : "bg-zinc-950/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Badges / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="p-3.5 sm:p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 hover:border-teal-500/50 hover:bg-zinc-900 transition-all flex items-center gap-3 group shadow-sm"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-zinc-950 transition-all">
                <DynamicIcon name={tool.iconName || "Box"} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="overflow-hidden min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-zinc-100 group-hover:text-teal-300 transition-colors truncate">
                  {tool.name}
                </h4>
                <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate">
                  {tool.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
