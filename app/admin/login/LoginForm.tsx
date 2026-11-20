"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

const inputClassName =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-3 pl-11 pr-11 text-sm text-white placeholder-zinc-600 transition-all outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15";

const authBackgroundStyle = {
  backgroundImage: "url('/auth-background.svg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao realizar login.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro inesperado ao tentar fazer login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={authBackgroundStyle} />
        <div className="absolute inset-0 bg-zinc-950/55" />
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <Link
        href="/"
        className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar ao portfólio</span>
      </Link>

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Painel administrativo
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Bem-vindo{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              de volta.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            Um espaço reservado para atualizar conteúdos, ajustar o perfil e
            manter tudo sincronizado.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Gerenciar projetos e experiências",
              "Atualizar perfil e redes sociais",
              "Controlar conteúdos do portfólio",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 inline-flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-xs text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Conexão segura · Acesso restrito
          </div>
        </section>

        <section className="card-motion relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-cyan-400" />

          <div className="mb-7 lg:hidden">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-zinc-950 shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Acesso administrativo</h1>
            <p className="mt-1 text-xs text-zinc-500">Entre com suas credenciais para continuar.</p>
          </div>

          <div className="mb-6 hidden lg:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
              Autenticação
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">Entrar na conta</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Informe suas credenciais para acessar o painel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Senha
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  Entrar no painel
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
            <span className="h-px flex-1 bg-zinc-800" />
            área restrita
            <span className="h-px flex-1 bg-zinc-800" />
          </div>
        </section>
      </div>
    </div>
  );
}
