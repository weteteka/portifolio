"use client";

import React from "react";
import { Profile } from "@/types/portfolio";
import { Mail, Phone, MapPin, CheckCircle, UserCheck } from "lucide-react";

interface AboutSectionProps {
  profile: Profile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="sobre" className="py-16 sm:py-24 bg-zinc-950 text-white relative border-t border-zinc-900 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>QUEM SOU EU</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Tudo Sobre Mim
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mt-3"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Photo & Quick Info Card */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="w-full max-w-sm rounded-3xl overflow-hidden bg-zinc-900/80 border border-zinc-800 p-5 sm:p-6 shadow-2xl relative">
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5 sm:mb-6 relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs bg-zinc-900/90 backdrop-blur-md py-1.5 px-3 rounded-lg border border-zinc-700/50 flex items-center justify-between">
                  <span className="font-semibold truncate mr-2">{profile.name}</span>
                  <span className="text-emerald-400 font-mono text-[11px] shrink-0">Online</span>
                </div>
              </div>

              {/* Quick Details */}
              <div className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{profile.location}</span>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`mailto:${profile.email}`} className="truncate hover:text-emerald-300">
                    {profile.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{profile.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Biography Text */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6 w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 leading-snug">
              Construindo o futuro digital através de código elegante e resultados comprovados.
            </h3>

            <div className="text-zinc-300 space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {profile.aboutMe}
            </div>

            <div className="pt-4 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-zinc-200">Compromisso com Prazos</h4>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">Entregas consistentes e pontuais em todas as fases do projeto.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-zinc-200">Arquitetura Moderna</h4>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">Padrões consolidados, código testável e fácil de manter.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
