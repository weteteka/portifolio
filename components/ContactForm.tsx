"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle, Loader2, Send } from "lucide-react";

const inputClassName =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Falha ao enviar a mensagem.");
      }

      setName("");
      setEmail("");
      setMessage("");
      setStatus("success");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Erro inesperado ao enviar a mensagem."
      );
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-motion rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6"
    >
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Empresa</label>
        <input
          id="company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Nome
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            E-mail
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            maxLength={254}
            required
            className={inputClassName}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Mensagem
        </span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Conte um pouco sobre seu projeto ou ideia..."
          rows={5}
          minLength={10}
          maxLength={2000}
          required
          className={`${inputClassName} resize-y`}
        />
      </label>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {status === "sending" ? "Enviando..." : "Enviar mensagem"}
        </button>

        {status === "success" && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Mensagem enviada. Obrigado pelo contato!
          </p>
        )}

        {status === "error" && (
          <p className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
