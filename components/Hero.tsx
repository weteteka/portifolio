"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { Profile, SocialLink } from "@/types/portfolio";
import { DynamicIcon } from "./DynamicIcon";
import { Modal } from "./Modal";
import { resolveAvatarUrl } from "@/lib/media";
import { ArrowDown, Download, Eye, Sparkles, Briefcase, Award, CheckCircle2 } from "lucide-react";

interface HeroProps {
  profile: Profile;
  socials: SocialLink[];
}

export function Hero({ profile, socials }: HeroProps) {
  const [bioOpen, setBioOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const avatarUrl = resolveAvatarUrl(profile.avatarUrl);
  const closeBio = useCallback(() => setBioOpen(false), []);
  const closeImage = useCallback(() => setImageOpen(false), []);

  return (
    <section className="relative min-h-[92vh] pt-2 sm:pt-3 pb-16 flex items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 w-full px-4 sm:px-6 lg:px-8">
      {/* Background radial glow safely contained */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-48 sm:w-[350px] h-48 sm:h-[350px] bg-cyan-500/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 w-full flex flex-col items-center text-center">
        {/* Status Badge */}
        <div className="flex items-center relative px-3 py-3 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm shadow-sm max-w-full">
          <span style={{"left": "6px"}} className="w-3 h-3 absolute rounded-full bg-emerald-400 shrink-0 animate-ping"></span>
          <span className="truncate">{profile.availability}</span>
        </div>

        {/* Profile Photo with Glow */}
        <div className="avatar-motion relative mb-6 sm:mb-8 rounded-full group shrink-0">
          <div className="absolute -inset-1.5 hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 sm:block"></div>
          <button
            type="button"
            onClick={() => setImageOpen(true)}
            aria-label="Ampliar foto de perfil"
            title="Ampliar foto de perfil"
            className="relative block cursor-zoom-in rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={profile.name || "Avatar padrão"}
              className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover object-top border-4 border-zinc-900 shadow-2xl"
            />
          </button>
          <div className="absolute bottom-1 right-1 p-1.5 sm:p-2 bg-zinc-900 border border-zinc-700 rounded-full text-emerald-400 shadow-md">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Name & Role */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3 sm:mb-4 max-w-3xl break-words">
          Olá, eu sou{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent inline-block">
            {profile.name}
          </span>
        </h1>

        <p className="text-base sm:text-xl md:text-2xl font-medium text-zinc-300 max-w-2xl mb-3 sm:mb-4 leading-snug">
          {profile.role}
        </p>

        <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mb-6 sm:mb-8 leading-relaxed px-2">
          {profile.tagline}
        </p>

        {/* Call to Actions - responsive flex */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-8 sm:mb-10 px-4 sm:px-0">
          <button
            type="button"
            onClick={() => setBioOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>Visualizar sobre mim</span>
          </button>

          <Link
            href="/projetos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5"
          >
            <span>Ver Meus Projetos</span>
            <ArrowDown className="w-4 h-4 shrink-0" />
          </Link>

          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Baixar Currículo</span>
            </a>
          )}

          <Link
            href="/contato"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-xs sm:text-sm transition-colors"
          >
            <span>Falar Comigo</span>
          </Link>
        </div>

        {/* Social Links Bar */}
        {socials.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-2.5 mb-10 sm:mb-12">
            <span className="text-[11px] sm:text-xs text-zinc-400 font-mono uppercase tracking-wider mr-1">
              Redes:
            </span>
            {socials.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/80 hover:bg-emerald-950/60 border border-zinc-800 hover:border-emerald-600/50 text-zinc-300 hover:text-emerald-300 transition-all hover:scale-110 shadow-sm"
                title={soc.platform}
                aria-label={soc.platform}
              >
                <DynamicIcon name={soc.icon || "Globe"} className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            ))}
          </div>
        )}

        {/* Floating Key Metrics / Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl">
          <div className="card-motion overflow-hidden p-4 sm:p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm flex items-center gap-3.5 sm:gap-4 text-left shadow-lg">
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white block">
                {profile.yearsOfExperience}+ Anos
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-400">De Experiência Prática</span>
            </div>
          </div>

          <div className="card-motion overflow-hidden p-4 sm:p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm flex items-center gap-3.5 sm:gap-4 text-left shadow-lg">
            <div className="p-2.5 sm:p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white block">
                {profile.projectsCompleted}+ Projetos
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-400">Concluídos com Sucesso</span>
            </div>
          </div>

          <div className="card-motion overflow-hidden p-4 sm:p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm flex items-center gap-3.5 sm:gap-4 text-left shadow-lg">
            <div className="p-2.5 sm:p-3 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white block">
                {profile.happyClients}+ Clientes
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-400">Totalmente Satisfeitos</span>
            </div>
          </div>
        </div>
      </div>

      <Modal open={bioOpen} onClose={closeBio} title="Sobre mim">
        <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-zinc-300">
          {profile.aboutMe}
        </p>
      </Modal>

      <Modal
        open={imageOpen}
        onClose={closeImage}
        title="Foto de perfil"
        wide
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt={profile.name || "Avatar padrão"}
          className="mx-auto max-h-[70vh] w-auto max-w-full rounded-2xl border border-zinc-800 object-contain"
        />
      </Modal>
    </section>
  );
}
