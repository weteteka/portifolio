"use client";

import React from "react";
import { Recommendation } from "@/types/portfolio";
import { Quote } from "lucide-react";
import { DynamicIcon } from "./DynamicIcon";

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  return (
    <section id="recomendacoes" className="py-16 sm:py-24 bg-zinc-950 text-white relative border-t border-zinc-900 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center mb-10 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <Quote className="w-3.5 h-3.5" />
            <span>FEEDBACK & DEPOIMENTOS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            O Que Dizem Sobre Mim
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base max-w-xl mt-2 px-2">
            Recomendações e avaliações de gestores, clientes e colegas com quem colaborei.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-xl relative"
            >
              <div className="mb-5 sm:mb-6">
                <div className="text-emerald-500/30 group-hover:text-emerald-400/50 transition-colors mb-3">
                  <Quote className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  &ldquo;{rec.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/70 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rec.avatarUrl}
                  alt={rec.author}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-emerald-500/40 shrink-0"
                />
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                      {rec.author}
                    </h4>
                    {rec.linkedinUrl && (
                      <a
                        href={rec.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-emerald-400 shrink-0"
                        title="Ver no LinkedIn"
                      >
                        <DynamicIcon name="Linkedin" className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 truncate">
                    {rec.role} · <span className="text-emerald-400">{rec.company}</span>
                  </p>
                  <span className="text-[10px] text-zinc-400 block truncate font-mono">
                    {rec.relationship}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
