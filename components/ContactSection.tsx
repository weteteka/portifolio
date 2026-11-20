import { Profile, SocialLink } from "@/types/portfolio";
import { DynamicIcon } from "./DynamicIcon";
import { ArrowUpRight, Mail, MessageSquare, Phone } from "lucide-react";

interface ContactSectionProps {
  profile: Profile;
  socials: SocialLink[];
}

export function ContactSection({ profile, socials }: ContactSectionProps) {
  const phoneHref = `tel:${profile.phone.replace(/[^\d+]/g, "")}`;

  return (
    <footer id="contato" className="relative w-full overflow-hidden border-t border-zinc-900 bg-zinc-950 pt-16 pb-10 text-white sm:pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>VAMOS CONVERSAR?</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Entre em Contato Comigo
          </h2>
          <p className="mt-2 max-w-xl px-2 text-xs text-zinc-400 sm:text-base">
            Escolha o canal que preferir. Estou disponível para projetos,
            parcerias e oportunidades.
          </p>
          <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
              Canais diretos
            </h3>
            <span className="h-px flex-1 bg-zinc-800" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a
              href={`mailto:${profile.email}`}
              className="group flex min-w-0 items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500 group-hover:text-zinc-950">
                <Mail className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] text-zinc-500 sm:text-xs">
                  E-mail
                </span>
                <span className="block truncate text-sm font-semibold text-zinc-100 transition-colors group-hover:text-emerald-300">
                  {profile.email}
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-emerald-400" />
            </a>

            <a
              href={phoneHref}
              className="group flex min-w-0 items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-colors group-hover:bg-cyan-500 group-hover:text-zinc-950">
                <Phone className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] text-zinc-500 sm:text-xs">
                  Telefone / WhatsApp
                </span>
                <span className="block truncate text-sm font-semibold text-zinc-100 transition-colors group-hover:text-cyan-300">
                  {profile.phone}
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-cyan-400" />
            </a>
          </div>
        </div>

        {socials.length > 0 && (
          <div className="mx-auto mt-12 max-w-4xl sm:mt-14">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
                Redes sociais
              </h3>
              <span className="h-px flex-1 bg-zinc-800" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {socials.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir ${soc.platform}`}
                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500 group-hover:text-zinc-950">
                    <DynamicIcon
                      name={soc.icon || "Globe"}
                      className="h-5 w-5"
                    />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-200 transition-colors group-hover:text-emerald-300">
                    {soc.platform}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-zinc-600 transition-colors group-hover:text-emerald-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-4xl border-t border-zinc-900 pt-6 text-center text-xs text-zinc-500 sm:text-left">
          © {new Date().getFullYear()} {profile.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
