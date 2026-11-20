"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Mail,
  Save,
  Upload,
  User,
  X,
} from "lucide-react";
import type { Profile } from "@/types/portfolio";
import { resolveAvatarUrl } from "@/lib/media";
import { formatPhone } from "@/lib/phone";

interface ProfileModalProps {
  open: boolean;
  profile: Profile;
  saving: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => void;
}

type ProfileModalFormProps = Omit<ProfileModalProps, "open">;

const STEPS = [
  {
    id: "identity",
    label: "Identidade",
    description: "Nome, cargo e foto",
    icon: User,
  },
  {
    id: "contact",
    label: "Contato",
    description: "E-mail, telefone e localização",
    icon: Mail,
  },
  {
    id: "about",
    label: "Sobre & Números",
    description: "Biografia, currículo e indicadores",
    icon: FileText,
  },
] as const;

const inputClassName =
  "w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-zinc-300 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function ProfileModal({ open, ...formProps }: ProfileModalProps) {
  if (!open) return null;
  return <ProfileModalForm {...formProps} />;
}

function ProfileModalForm({
  profile,
  saving,
  onClose,
  onSave,
}: ProfileModalFormProps) {
  const [draft, setDraft] = useState<Profile>(profile);
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLastStep = step === STEPS.length - 1;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Falha ao enviar a imagem.");
      }

      update("avatarUrl", result.url);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Erro ao enviar a imagem."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const goToStep = (index: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, index)));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLastStep) {
      goToStep(step + 1);
      return;
    }
    onSave(draft);
  };

  const currentStep = STEPS[step];

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
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3 mb-4">
          <div>
            <h3 id="profile-modal-title" className="text-base sm:text-lg font-bold text-white">
              Editar dados pessoais
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Etapa {step + 1} de {STEPS.length} · Alterações são salvas no banco ao confirmar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 shrink-0"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            const active = index === step;
            const done = index < step;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goToStep(index)}
                aria-current={active ? "step" : undefined}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-colors ${
                  active
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : done
                      ? "border-emerald-500/25 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    active || done
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {done ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-xs font-semibold truncate ${
                      active || done ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="block text-[10px] text-zinc-500 truncate">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-emerald-500 transition-all duration-200"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-white">{currentStep.label}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">{currentStep.description}</p>
          </div>

          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nome Completo">
                <input
                  type="text"
                  value={draft.name}
                  onChange={(event) => update("name", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Título / Cargo Profissional">
                <input
                  type="text"
                  value={draft.role}
                  onChange={(event) => update("role", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Tagline" className="sm:col-span-2">
                <input
                  type="text"
                  value={draft.tagline}
                  onChange={(event) => update("tagline", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Foto de Perfil" className="sm:col-span-2">
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                  <input
                    type="text"
                    value={draft.avatarUrl}
                    onChange={(event) => update("avatarUrl", event.target.value)}
                    placeholder="URL da imagem"
                    className={`${inputClassName} flex-1 min-w-0`}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors disabled:opacity-60"
                  >
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    {uploading ? "Enviando..." : "Enviar"}
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveAvatarUrl(draft.avatarUrl)}
                    alt="Prévia do avatar"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-zinc-700 shrink-0 self-center"
                  />
                </div>
                {uploadError && (
                  <p className="mt-2 text-[11px] text-red-400">{uploadError}</p>
                )}
                <p className="mt-2 text-[11px] text-zinc-500">
                  PNG, JPG, WEBP ou GIF até 5 MB. Envio via Cloudinary quando configurado.
                </p>
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="E-mail de Contato">
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) => update("email", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Telefone / WhatsApp">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="9xx xxx xxx"
                  maxLength={11}
                  value={formatPhone(draft.phone)}
                  onChange={(event) =>
                    update("phone", formatPhone(event.target.value))
                  }
                  className={inputClassName}
                />
              </Field>

              <Field label="Localização">
                <input
                  type="text"
                  value={draft.location}
                  onChange={(event) => update("location", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Status de Disponibilidade">
                <input
                  type="text"
                  value={draft.availability}
                  onChange={(event) => update("availability", event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label="Biografia Detalhada">
                <textarea
                  rows={5}
                  value={draft.aboutMe}
                  onChange={(event) => update("aboutMe", event.target.value)}
                  className={`${inputClassName} leading-relaxed`}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Anos de Experiência">
                  <input
                    type="number"
                    value={draft.yearsOfExperience}
                    onChange={(event) =>
                      update("yearsOfExperience", Number(event.target.value) || 0)
                    }
                    className={inputClassName}
                  />
                </Field>
                <Field label="Projetos Concluídos">
                  <input
                    type="number"
                    value={draft.projectsCompleted}
                    onChange={(event) =>
                      update("projectsCompleted", Number(event.target.value) || 0)
                    }
                    className={inputClassName}
                  />
                </Field>
                <Field label="Clientes Atendidos">
                  <input
                    type="number"
                    value={draft.happyClients}
                    onChange={(event) =>
                      update("happyClients", Number(event.target.value) || 0)
                    }
                    className={inputClassName}
                  />
                </Field>
              </div>

              <Field label="Link do Currículo">
                <input
                  type="text"
                  value={draft.resumeUrl}
                  onChange={(event) => update("resumeUrl", event.target.value)}
                  placeholder="https://exemplo.com/curriculo.pdf"
                  className={inputClassName}
                />
              </Field>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
            >
              Cancelar
            </button>

            <div className="flex gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => goToStep(step - 1)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
              )}
              <button
                type="submit"
                disabled={isLastStep && saving}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all min-w-[9.5rem]"
              >
                {isLastStep ? (
                  <>
                    <Save className="w-4 h-4" />
                    {saving ? "Salvando..." : "Salvar dados pessoais"}
                  </>
                ) : (
                  <>
                    Próxima etapa
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
