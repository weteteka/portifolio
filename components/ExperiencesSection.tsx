"use client";

import React from "react";
import { Experience } from "@/types/portfolio";
import { Briefcase, Calendar, MapPin, ExternalLink, CheckCircle2 } from "lucide-react";

interface ExperiencesSectionProps {
  experiences: Experience[];
}

export function ExperiencesSection({ experiences }: ExperiencesSectionProps) {
  return (
    <section id="empresas" className="py-16 sm:py-24 bg-zinc-950 text-white relative border-t border-zinc-900 w-full overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>TRAJETÓRIA PROFISSIONAL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Empresas Onde Já Trabalhei
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base max-w-xl mt-2 px-2">
            Histórico de atuação, contribuições relevantes e impacto gerado nas organizações.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-3"></div>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-zinc-800 ml-2 sm:ml-6 md:ml-12 space-y-8 sm:space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-5 sm:pl-8 md:pl-10 group">
              {/* Timeline marker */}
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-zinc-950 border-2 border-emerald-500 group-hover:bg-emerald-400 transition-colors shadow-sm shadow-emerald-500/40" />

              {/* Company & Role Card */}
              <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 hover:border-emerald-500/40 transition-all hover:bg-zinc-900 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                      <span>{exp.role}</span>
                      {exp.companyUrl && (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-emerald-400 shrink-0"
                          title="Visitar site da empresa"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </h3>
                    <span className="text-emerald-400 font-semibold text-xs sm:text-sm">
                      {exp.company}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-zinc-400">
                    <span className="inline-flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded-md">
                      <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>{exp.period}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>{exp.location}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                  {exp.description}
                </p>

                {/* Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-4 sm:mb-5 space-y-2">
                    <h4 className="text-[11px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                      Principais Conquistas & Entregas:
                    </h4>
                    <ul className="space-y-1.5">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies used in the company */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/60">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
