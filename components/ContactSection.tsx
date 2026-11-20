"use client";

import React, { useState } from "react";
import { Profile, SocialLink } from "@/types/portfolio";
import { DynamicIcon } from "./DynamicIcon";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  ArrowUp,
  CheckCircle,
} from "lucide-react";

interface ContactSectionProps {
  profile: Profile;
  socials: SocialLink[];
}

export function ContactSection({ profile, socials }: ContactSectionProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
      formState.subject || `Contato pelo Portfólio de ${formState.name}`
    )}&body=${encodeURIComponent(
      `Nome: ${formState.name}\nE-mail: ${formState.email}\n\nMensagem:\n${formState.message}`
    )}`;
    window.open(mailtoUrl, "_blank");
    setSubmitted(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contato" className="bg-zinc-950 text-white relative border-t border-zinc-900 pt-16 sm:pt-24 pb-10 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>VAMOS CONVERSAR?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Entre em Contato Comigo
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base max-w-xl mt-2 px-2">
            Disponível para novos projetos desafiadores, parcerias, consultorias e oportunidades.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mt-3"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 sm:mb-20">
          {/* Contact Information & Channels */}
          <div className="lg:col-span-5 space-y-5">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Canais Diretos de Comunicação
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Fique à vontade para me enviar uma mensagem por e-mail, ligar ou chamar no WhatsApp. Responderei com agilidade!
            </p>

            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all group min-w-0"
              >
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs text-zinc-400 block font-mono">E-mail</span>
                  <span className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors truncate block">
                    {profile.email}
                  </span>
                </div>
              </a>

              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all group min-w-0"
              >
                <div className="p-2.5 sm:p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs text-zinc-400 block font-mono">Telefone / WhatsApp</span>
                  <span className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors truncate block">
                    {profile.phone}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 min-w-0">
                <div className="p-2.5 sm:p-3 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs text-zinc-400 block font-mono">Localização Atual</span>
                  <span className="text-xs sm:text-sm font-semibold text-zinc-100 truncate block">
                    {profile.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-3">
              <span className="text-[11px] font-mono uppercase text-zinc-400 block mb-2.5">
                Redes Sociais:
              </span>
              <div className="flex flex-wrap gap-2">
                {socials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-300 transition-all shadow-sm"
                    title={soc.platform}
                    aria-label={soc.platform}
                  >
                    <DynamicIcon name={soc.icon || "Globe"} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                Envie uma Mensagem Rápida
              </h3>
              <p className="text-xs text-zinc-400 mb-5">
                Preencha os campos abaixo e entraremos em contato diretamente.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
                  <CheckCircle className="w-8 h-8 mx-auto text-emerald-400" />
                  <h4 className="font-bold text-base">Mensagem pronta!</h4>
                  <p className="text-xs text-zinc-400">
                    Seu cliente de e-mail padrão foi aberto com os dados preenchidos.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs underline hover:text-emerald-200"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Seu Nome *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Ex: Carlos Santana"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Seu E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="Ex: carlos@empresa.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Assunto
                    </label>
                    <input
                      type="text"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="Ex: Proposta de Projeto / Oportunidade"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Sua Mensagem *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Descreva brevemente sua ideia, demanda ou projeto..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Enviar Mensagem</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {profile.name}. Todos os direitos reservados.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title="Voltar ao Topo"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
