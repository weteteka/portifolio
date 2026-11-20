"use client";

import React, { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import type { Profile } from "@/types/portfolio";

interface ProfileModalProps {
  open: boolean;
  profile: Profile;
  saving: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => void;
}

export function ProfileModal({
  open,
  profile,
  saving,
  onClose,
  onSave,
}: ProfileModalProps) {
  const [draft, setDraft] = useState<Profile>(profile);

  useEffect(() => {
    if (open) setDraft(profile);
  }, [open, profile]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl w-full max-w-3xl p-5 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 my-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-5">
          <div>
            <h3 id="profile-modal-title" className="text-base sm:text-lg font-bold text-white">
              Editar dados pessoais
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Alterações são salvas no banco de dados ao confirmar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave(draft);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Título / Cargo Profissional
              </label>
              <input
                type="text"
                value={draft.role}
                onChange={(event) => update("role", event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={draft.tagline}
                onChange={(event) => update("tagline", event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                URL da Foto de Perfil
              </label>
              <div className="flex gap-2.5 items-center">
                <input
                  type="text"
                  value={draft.avatarUrl}
                  onChange={(event) => update("avatarUrl", event.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 min-w-0"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.avatarUrl}
                  alt="Prévia do avatar"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-zinc-700 shrink-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                E-mail de Contato
              </label>
              <input
                type="email"
                value={draft.email}
                onChange={(event) => update("email", event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={draft.phone}
                onChange={(event) => update("phone", event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Localização
              </label>
              <input
                type="text"
                value={draft.location}
                onChange={(event) => update("location", event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Status de Disponibilidade
              </label>
              <input
                type="text"
                value={draft.availability}
                onChange={(event) => update("availability", event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 sm:col-span-2">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Anos de Experiência
                </label>
                <input
                  type="number"
                  value={draft.yearsOfExperience}
                  onChange={(event) =>
                    update("yearsOfExperience", Number(event.target.value) || 0)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Projetos Concluídos
                </label>
                <input
                  type="number"
                  value={draft.projectsCompleted}
                  onChange={(event) =>
                    update("projectsCompleted", Number(event.target.value) || 0)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Clientes Atendidos
                </label>
                <input
                  type="number"
                  value={draft.happyClients}
                  onChange={(event) =>
                    update("happyClients", Number(event.target.value) || 0)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Link do Currículo
              </label>
              <input
                type="text"
                value={draft.resumeUrl}
                onChange={(event) => update("resumeUrl", event.target.value)}
                placeholder="https://exemplo.com/curriculo.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Biografia Detalhada
              </label>
              <textarea
                rows={5}
                value={draft.aboutMe}
                onChange={(event) => update("aboutMe", event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar dados pessoais"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
