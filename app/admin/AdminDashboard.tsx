"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PortfolioData,
  Skill,
  Strength,
  Language,
  Tool,
  Recommendation,
  Project,
  Experience,
  SocialLink,
  Profile,
} from "@/types/portfolio";
import { DEFAULT_AVATAR_URL, DEFAULT_PROJECT_IMAGE_URL, resolveAvatarUrl, resolveProjectImageUrl } from "@/lib/media";
import { DynamicIcon, ICON_OPTIONS } from "@/components/DynamicIcon";
import { ProfileModal } from "@/components/ProfileModal";
import {
  User,
  Code2,
  Sparkles,
  Globe2,
  Wrench,
  FolderGit2,
  Briefcase,
  Quote,
  Share2,
  Save,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Menu,
} from "lucide-react";

interface AdminDashboardProps {
  initialData: PortfolioData;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

type TabType =
  | "profile"
  | "skills"
  | "strengths"
  | "languages"
  | "tools"
  | "projects"
  | "experiences"
  | "recommendations"
  | "socials";

export function AdminDashboard({ initialData, user }: AdminDashboardProps) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData>(initialData);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [saving, setSaving] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal / Form state for item editing
  const [editingItem, setEditingItem] = useState<{
    tab: TabType;
    index: number | null; // null means new item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any;
  } | null>(null);

  const showNotification = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveAll = async (overrideData?: PortfolioData) => {
    setSaving(true);
    const payload = overrideData || data;

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao salvar dados.");

      showNotification("success", "Todas as alterações foram salvas com sucesso!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showNotification("error", err.message);
      } else {
        showNotification("error", "Erro ao salvar alterações.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (profile: Profile) => {
    const updated: PortfolioData = { ...data, profile };
    setData(updated);
    setProfileModalOpen(false);
    await handleSaveAll(updated);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // Helper to open create modal
  const openNewItem = (tab: TabType) => {
    if (tab === "skills") {
      setEditingItem({
        tab,
        index: null,
        values: {
          id: `skill-${Date.now()}`,
          name: "",
          category: "Frontend",
          level: 80,
          highlight: false,
        } as Skill,
      });
    } else if (tab === "strengths") {
      setEditingItem({
        tab,
        index: null,
        values: {
          id: `strength-${Date.now()}`,
          title: "",
          description: "",
          icon: "Sparkles",
        } as Strength,
      });
    } else if (tab === "languages") {
      setEditingItem({
        tab,
        index: null,
        values: {
          id: `lang-${Date.now()}`,
          name: "",
          level: "Fluente",
          percentage: 85,
        } as Language,
      });
    } else if (tab === "tools") {
      setEditingItem({
        tab,
        index: null,
        values: {
          id: `tool-${Date.now()}`,
          name: "",
          category: "Desenvolvimento",
          iconName: "Code",
        } as Tool,
      });
    } else if (tab === "projects") {
      setEditingItem({
        tab,
        index: null,
        values: {
          id: `proj-${Date.now()}`,
          title: "",
          description: "",
          longDescription: "",
          imageUrl: DEFAULT_PROJECT_IMAGE_URL,
          tagsString: "React, Next.js, TypeScript",
          liveUrl: "",
          githubUrl: "",
          featured: false,
          category: "Full Stack",
        },
      });
    } else if (tab === "experiences") {
      setEditingItem({
        tab,
        index: null,
        values: {
          id: `exp-${Date.now()}`,
          company: "",
          role: "",
          period: "2024 - Presente",
          location: "Remoto",
          description: "",
          achievementsString: "",
          technologiesString: "TypeScript, React, Node.js",
          companyUrl: "",
        },
      });
    } else if (tab === "recommendations") {
      setEditingItem({
        tab,
        index: null,
        values: {
          id: `rec-${Date.now()}`,
          author: "",
          role: "",
          company: "",
          avatarUrl: DEFAULT_AVATAR_URL,
          content: "",
          relationship: "Colega de trabalho",
          linkedinUrl: "",
        } as Recommendation,
      });
    } else if (tab === "socials") {
      setEditingItem({
        tab,
        index: null,
        values: {
          id: `soc-${Date.now()}`,
          platform: "GitHub",
          url: "https://",
          icon: "Github",
        } as SocialLink,
      });
    }
  };

  // Helper to open edit modal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditItem = (tab: TabType, index: number, item: any) => {
    if (tab === "projects") {
      setEditingItem({
        tab,
        index,
        values: {
          ...item,
          tagsString: item.tags?.join(", ") || "",
        },
      });
    } else if (tab === "experiences") {
      setEditingItem({
        tab,
        index,
        values: {
          ...item,
          achievementsString: item.achievements?.join("\n") || "",
          technologiesString: item.technologies?.join(", ") || "",
        },
      });
    } else {
      setEditingItem({
        tab,
        index,
        values: { ...item },
      });
    }
  };

  // Save modal edit or create
  const handleSaveModal = () => {
    if (!editingItem) return;
    const { tab, index, values } = editingItem;

    const updated = { ...data };

    if (tab === "skills") {
      const item: Skill = {
        ...values,
        level: Number(values.level) || 0,
      };
      if (index === null) updated.skills = [...updated.skills, item];
      else updated.skills[index] = item;
    } else if (tab === "strengths") {
      const item: Strength = { ...values };
      if (index === null) updated.strengths = [...updated.strengths, item];
      else updated.strengths[index] = item;
    } else if (tab === "languages") {
      const item: Language = {
        ...values,
        percentage: Number(values.percentage) || 0,
      };
      if (index === null) updated.languages = [...updated.languages, item];
      else updated.languages[index] = item;
    } else if (tab === "tools") {
      const item: Tool = { ...values };
      if (index === null) updated.tools = [...updated.tools, item];
      else updated.tools[index] = item;
    } else if (tab === "projects") {
      const tags = (values.tagsString || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
      const item: Project = {
        id: values.id,
        title: values.title,
        description: values.description,
        longDescription: values.longDescription,
        imageUrl: values.imageUrl,
        tags,
        liveUrl: values.liveUrl,
        githubUrl: values.githubUrl,
        featured: Boolean(values.featured),
        category: values.category,
      };
      if (index === null) updated.projects = [...updated.projects, item];
      else updated.projects[index] = item;
    } else if (tab === "experiences") {
      const achievements = (values.achievementsString || "")
        .split("\n")
        .map((a: string) => a.trim())
        .filter(Boolean);
      const technologies = (values.technologiesString || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
      const item: Experience = {
        id: values.id,
        company: values.company,
        role: values.role,
        period: values.period,
        location: values.location,
        description: values.description,
        achievements,
        technologies,
        companyUrl: values.companyUrl,
      };
      if (index === null) updated.experiences = [...updated.experiences, item];
      else updated.experiences[index] = item;
    } else if (tab === "recommendations") {
      const item: Recommendation = { ...values };
      if (index === null) updated.recommendations = [...updated.recommendations, item];
      else updated.recommendations[index] = item;
    } else if (tab === "socials") {
      const item: SocialLink = { ...values };
      if (index === null) updated.socials = [...updated.socials, item];
      else updated.socials[index] = item;
    }

    setData(updated);
    setEditingItem(null);
    handleSaveAll(updated);
  };

  // Delete item helper
  const handleDeleteItem = (tab: TabType, index: number) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    const updated = { ...data };

    if (tab === "skills") updated.skills.splice(index, 1);
    else if (tab === "strengths") updated.strengths.splice(index, 1);
    else if (tab === "languages") updated.languages.splice(index, 1);
    else if (tab === "tools") updated.tools.splice(index, 1);
    else if (tab === "projects") updated.projects.splice(index, 1);
    else if (tab === "experiences") updated.experiences.splice(index, 1);
    else if (tab === "recommendations") updated.recommendations.splice(index, 1);
    else if (tab === "socials") updated.socials.splice(index, 1);

    setData(updated);
    handleSaveAll(updated);
  };

  const navTabs = [
    { id: "profile", label: "Perfil & Sobre", icon: User },
    { id: "skills", label: "Habilidades", icon: Code2, count: data.skills.length },
    { id: "strengths", label: "Potencialidades", icon: Sparkles, count: data.strengths.length },
    { id: "languages", label: "Idiomas", icon: Globe2, count: data.languages.length },
    { id: "tools", label: "Ferramentas", icon: Wrench, count: data.tools.length },
    { id: "projects", label: "Projetos", icon: FolderGit2, count: data.projects.length },
    { id: "experiences", label: "Empresas", icon: Briefcase, count: data.experiences.length },
    { id: "recommendations", label: "Recomendações", icon: Quote, count: data.recommendations.length },
    { id: "socials", label: "Redes Sociais", icon: Share2, count: data.socials.length },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col w-full overflow-x-hidden">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 border-b border-zinc-800 backdrop-blur-md px-3 sm:px-8 py-3 flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors shrink-0"
            aria-label="Abrir menu de seções"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20 shrink-0 text-sm sm:text-base">
            A
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-xs sm:text-base text-white flex items-center gap-1.5 truncate">
              <span>Admin</span>
              <span className="hidden sm:inline">Portfólio</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-mono truncate">
              {user.name}
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={() => setProfileModalOpen(true)}
            className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
            title="Editar dados pessoais"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Meu Perfil</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
            title="Ver Portfólio ao Vivo"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Ver Site</span>
          </Link>

          <button
            onClick={() => handleSaveAll()}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Encerrar Sessão"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Floating Notification */}
      {message && (
        <div
          className={`fixed bottom-5 right-5 left-5 sm:left-auto z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm animate-in slide-in-from-bottom duration-300 ${
            message.type === "success"
              ? "bg-emerald-950 border border-emerald-700 text-emerald-200"
              : "bg-red-950 border border-red-700 text-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Admin Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex flex-col lg:flex-row gap-5 lg:gap-8">
        {/* Mobile Sidebar Drawer (< 1024px) */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Menu de seções">
            <button
              type="button"
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            />
            <aside className="relative w-72 max-w-[85vw] h-full bg-zinc-900 border-r border-zinc-800 p-3 shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
                  Seções do Portfólio
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  aria-label="Fechar menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as TabType);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/30"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.count !== undefined && (
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                            isActive ? "bg-emerald-700 text-emerald-100" : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        )}

        {/* Desktop Sidebar Nav (>= 1024px) */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-2.5 space-y-1 sticky top-20">
            <div className="px-3 py-2 text-[11px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
              Seções do Portfólio
            </div>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/30"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? "bg-emerald-700 text-emerald-100" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Tab Content Panel */}
        <div className="flex-1 min-w-0 w-full">
          {/* TAB 1: PERFIL & SOBRE MIM */}
          {activeTab === "profile" && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Perfil & Sobre Mim</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Visualize e edite as informações pessoais, dados de contato, foto e biografia.
                  </p>
                </div>
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all w-full sm:w-auto"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar dados pessoais</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveAvatarUrl(data.profile.avatarUrl)}
                  alt="Foto de perfil"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-zinc-700 shadow-lg shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white truncate">{data.profile.name}</h3>
                  <p className="text-sm text-emerald-400 font-medium">{data.profile.role}</p>
                  <p className="text-xs text-zinc-400">{data.profile.tagline}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1">E-mail</p>
                  <p className="text-zinc-200 break-all">{data.profile.email || "-"}</p>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1">Telefone / WhatsApp</p>
                  <p className="text-zinc-200">{data.profile.phone || "-"}</p>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1">Localização</p>
                  <p className="text-zinc-200">{data.profile.location || "-"}</p>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1">Disponibilidade</p>
                  <p className="text-zinc-200">{data.profile.availability || "-"}</p>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1">Anos de experiência</p>
                  <p className="text-zinc-200">{data.profile.yearsOfExperience}</p>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1">Projetos / Clientes</p>
                  <p className="text-zinc-200">{data.profile.projectsCompleted} projetos · {data.profile.happyClients} clientes</p>
                </div>
              </div>

              {data.profile.aboutMe && (
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5">
                  <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1.5">Biografia</p>
                  <p className="text-xs sm:text-sm text-zinc-300 whitespace-pre-line leading-relaxed">{data.profile.aboutMe}</p>
                </div>
              )}

              {data.profile.resumeUrl && (
                <a
                  href={data.profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver currículo
                </a>
              )}
            </div>
          )}

          {/* TAB 2: HABILIDADES */}
          {activeTab === "skills" && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Minhas Habilidades</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Gerencie suas habilidades técnicas, categorias e percentuais de proficiência.
                  </p>
                </div>
                <button
                  onClick={() => openNewItem("skills")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Habilidade</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {data.skills.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between group hover:border-emerald-500/40 transition-all gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-white truncate">{skill.name}</span>
                        {skill.highlight && (
                          <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                            Destaque
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1 font-mono">
                        <span className="truncate">{skill.category}</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-bold shrink-0">{skill.level}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditItem("skills", index, skill)}
                        className="p-1.5 sm:p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem("skills", index)}
                        className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: POTENCIALIDADES */}
          {activeTab === "strengths" && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Minhas Potencialidades</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Destaque seus diferenciais de metodologia, liderança e resolução de problemas.
                  </p>
                </div>
                <button
                  onClick={() => openNewItem("strengths")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white shadow-md shadow-cyan-600/30 transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Potencialidade</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {data.strengths.map((str, index) => (
                  <div
                    key={str.id}
                    className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between group hover:border-cyan-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                          <DynamicIcon name={str.icon || "Sparkles"} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditItem("strengths", index, str)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("strengths", index)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">{str.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{str.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: IDIOMAS */}
          {activeTab === "languages" && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Idiomas</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Gerencie seus idiomas e nível de fluência.
                  </p>
                </div>
                <button
                  onClick={() => openNewItem("languages")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white shadow-md shadow-cyan-600/30 transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Idioma</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
                {data.languages.map((lang, index) => (
                  <div
                    key={lang.id}
                    className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm sm:text-base text-white">{lang.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditItem("languages", index, lang)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("languages", index)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-cyan-300 block mb-3">
                        {lang.level}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                        <span>Proficiência</span>
                        <span className="text-cyan-400 font-bold">{lang.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FERRAMENTAS */}
          {activeTab === "tools" && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Ferramentas & Tecnologias</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Editores, softwares e utilitários do dia a dia.
                  </p>
                </div>
                <button
                  onClick={() => openNewItem("tools")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white shadow-md shadow-teal-600/30 transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Ferramenta</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
                {data.tools.map((tool, index) => (
                  <div
                    key={tool.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between group hover:border-teal-500/40 transition-all min-w-0"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                        <DynamicIcon name={tool.iconName || "Box"} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs sm:text-sm text-white block truncate">{tool.name}</span>
                        <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono block truncate">
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditItem("tools", index, tool)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem("tools", index)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROJETOS */}
          {activeTab === "projects" && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Meus Projetos</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Adicione, altere descrições, imagens, tags e links de seus projetos.
                  </p>
                </div>
                <button
                  onClick={() => openNewItem("projects")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white shadow-md shadow-cyan-600/30 transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Projeto</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {data.projects.map((proj, index) => (
                  <div
                    key={proj.id}
                    className="rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden flex flex-col justify-between group hover:border-cyan-500/40 transition-all"
                  >
                    <div className="aspect-video w-full relative bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveProjectImageUrl(proj.imageUrl)}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-900/90 text-cyan-300 border border-zinc-700/60">
                          {proj.category}
                        </span>
                        {proj.featured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Destaque
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-white mb-1.5">{proj.title}</h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {proj.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono truncate mr-2">
                          {proj.liveUrl && <span>Demo</span>}
                          {proj.githubUrl && <span>· GitHub</span>}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => openEditItem("projects", index, proj)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("projects", index)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: EMPRESAS & EXPERIÊNCIAS */}
          {activeTab === "experiences" && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Empresas Onde Trabalhei</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Cargos, empresas, realizações e tecnologias aplicadas.
                  </p>
                </div>
                <button
                  onClick={() => openNewItem("experiences")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Experiência</span>
                </button>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {data.experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-white">{exp.role}</h3>
                        <span className="text-emerald-400 font-semibold text-xs">
                          {exp.company}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-md truncate">
                          {exp.period} · {exp.location}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => openEditItem("experiences", index, exp)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("experiences", index)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                      {exp.description}
                    </p>

                    {exp.achievements?.length > 0 && (
                      <div className="mb-3">
                        <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                          Conquistas:
                        </span>
                        <ul className="list-disc list-inside text-xs text-zinc-400 space-y-0.5 mt-1">
                          {exp.achievements.map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {exp.technologies?.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: RECOMENDAÇÕES */}
          {activeTab === "recommendations" && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Recomendações & Depoimentos</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Feedbacks de colegas, gestores e clientes.
                  </p>
                </div>
                <button
                  onClick={() => openNewItem("recommendations")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Recomendação</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {data.recommendations.map((rec, index) => (
                  <div
                    key={rec.id}
                    className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveAvatarUrl(rec.avatarUrl)}
                            alt={rec.author}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-emerald-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-white truncate">{rec.author}</h4>
                            <p className="text-[11px] text-zinc-400 truncate">
                              {rec.role} · <span className="text-emerald-400">{rec.company}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => openEditItem("recommendations", index, rec)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("recommendations", index)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 italic leading-relaxed">
                        &ldquo;{rec.content}&rdquo;
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-zinc-900 text-[10px] text-zinc-400 font-mono">
                      Relação: {rec.relationship}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: REDES SOCIAIS */}
          {activeTab === "socials" && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Redes Sociais</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Links para seus perfis, repositórios e formas de contato.
                  </p>
                </div>
                <button
                  onClick={() => openNewItem("socials")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Rede Social</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {data.socials.map((soc, index) => (
                  <div
                    key={soc.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between min-w-0"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <DynamicIcon name={soc.icon || "Globe"} className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs sm:text-sm text-white block truncate">{soc.platform}</span>
                        <a
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] sm:text-xs text-zinc-400 hover:text-emerald-400 font-mono truncate block max-w-full"
                        >
                          {soc.url}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={() => openEditItem("socials", index, soc)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem("socials", index)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item Create / Edit Modal (Ultra-responsive) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-7 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {editingItem.index === null ? "Adicionar Novo Item" : "Editar Item"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Based on Tab */}
            <div className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
              {/* SKILLS */}
              {editingItem.tab === "skills" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Nome da Habilidade
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.name}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, name: e.target.value },
                        })
                      }
                      placeholder="Ex: Next.js, Node.js"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Categoria
                    </label>
                    <select
                      value={editingItem.values.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, category: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                      <option value="Mobile & Outros">Mobile & Outros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Nível de Domínio: {editingItem.values.level}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={editingItem.values.level}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, level: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-emerald-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="highlight-check"
                      checked={editingItem.values.highlight}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, highlight: e.target.checked },
                        })
                      }
                      className="rounded bg-zinc-950 border-zinc-800 text-emerald-500 w-4 h-4"
                    />
                    <label htmlFor="highlight-check" className="text-xs text-zinc-300">
                      Marcar como destaque principal
                    </label>
                  </div>
                </>
              )}

              {/* STRENGTHS */}
              {editingItem.tab === "strengths" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Título da Potencialidade
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.title}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, title: e.target.value },
                        })
                      }
                      placeholder="Ex: Arquitetura Escalável"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Ícone Representativo
                    </label>
                    <select
                      value={editingItem.values.icon}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, icon: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    >
                      {ICON_OPTIONS.map((ico) => (
                        <option key={ico} value={ico}>
                          {ico}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Descrição
                    </label>
                    <textarea
                      rows={3}
                      value={editingItem.values.description}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, description: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                </>
              )}

              {/* LANGUAGES */}
              {editingItem.tab === "languages" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Idioma
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.name}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, name: e.target.value },
                        })
                      }
                      placeholder="Ex: Inglês, Espanhol, Francês"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Nível de Proficiência
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.level}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, level: e.target.value },
                        })
                      }
                      placeholder="Ex: Fluente / C1, Nativo, Intermediário"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Percentual: {editingItem.values.percentage}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={editingItem.values.percentage}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, percentage: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </>
              )}

              {/* TOOLS */}
              {editingItem.tab === "tools" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Nome da Ferramenta
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.name}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, name: e.target.value },
                        })
                      }
                      placeholder="Ex: Docker, Figma, VS Code"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Categoria
                    </label>
                    <select
                      value={editingItem.values.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, category: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    >
                      <option value="Desenvolvimento">Desenvolvimento</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                      <option value="Design & Prototipagem">Design & Prototipagem</option>
                      <option value="Produtividade">Produtividade</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Ícone
                    </label>
                    <select
                      value={editingItem.values.iconName}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, iconName: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    >
                      {ICON_OPTIONS.map((ico) => (
                        <option key={ico} value={ico}>
                          {ico}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* PROJECTS */}
              {editingItem.tab === "projects" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Título do Projeto
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.title}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, title: e.target.value },
                        })
                      }
                      placeholder="Ex: Plataforma SaaS"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Categoria
                    </label>
                    <select
                      value={editingItem.values.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, category: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    >
                      <option value="Full Stack">Full Stack</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      URL da Imagem
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.imageUrl}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, imageUrl: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Descrição Curta
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.values.description}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, description: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Tecnologias / Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.tagsString}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, tagsString: e.target.value },
                        })
                      }
                      placeholder="React, Next.js, Node.js, Tailwind"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Link de Demo ao Vivo
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.liveUrl || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, liveUrl: e.target.value },
                          })
                        }
                        placeholder="https://meuprojeto.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Link do Repositório GitHub
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.githubUrl || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, githubUrl: e.target.value },
                          })
                        }
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="featured-proj"
                      checked={editingItem.values.featured}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, featured: e.target.checked },
                        })
                      }
                      className="rounded bg-zinc-950 border-zinc-800 text-cyan-500 w-4 h-4"
                    />
                    <label htmlFor="featured-proj" className="text-xs text-zinc-300">
                      Marcar como projeto em destaque
                    </label>
                  </div>
                </>
              )}

              {/* EXPERIENCES */}
              {editingItem.tab === "experiences" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.company}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, company: e.target.value },
                          })
                        }
                        placeholder="Ex: Google, Nubank"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.role}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, role: e.target.value },
                          })
                        }
                        placeholder="Ex: Engenheiro de Software"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Período
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.period}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, period: e.target.value },
                          })
                        }
                        placeholder="2022 - Presente"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Localização / Modelo
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.location}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, location: e.target.value },
                          })
                        }
                        placeholder="Remoto / São Paulo"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Descrição Geral das Atividades
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.values.description}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, description: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Principais Conquistas (uma por linha)
                    </label>
                    <textarea
                      rows={3}
                      value={editingItem.values.achievementsString}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, achievementsString: e.target.value },
                        })
                      }
                      placeholder="Redução de 40% na latência&#10;Liderança de time de 5 pessoas"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Tecnologias Utilizadas (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.technologiesString}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, technologiesString: e.target.value },
                        })
                      }
                      placeholder="React, Node.js, AWS, Docker"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                </>
              )}

              {/* RECOMMENDATIONS */}
              {editingItem.tab === "recommendations" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Nome da Pessoa
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.author}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, author: e.target.value },
                          })
                        }
                        placeholder="Ex: Maria Santos"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.role}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, role: e.target.value },
                          })
                        }
                        placeholder="Ex: Tech Lead"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.company}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, company: e.target.value },
                          })
                        }
                        placeholder="Ex: InovaTech"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Relação Profissional
                      </label>
                      <input
                        type="text"
                        value={editingItem.values.relationship}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            values: { ...editingItem.values, relationship: e.target.value },
                          })
                        }
                        placeholder="Ex: Gestor direto, Cliente"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      URL da Foto / Avatar
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.avatarUrl}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, avatarUrl: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Texto do Depoimento
                    </label>
                    <textarea
                      rows={3}
                      value={editingItem.values.content}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, content: e.target.value },
                        })
                      }
                      placeholder="Excelente desenvolvedor, pontual e muito dedicado..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Link do LinkedIn (Opcional)
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.linkedinUrl || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, linkedinUrl: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                </>
              )}

              {/* SOCIALS */}
              {editingItem.tab === "socials" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Plataforma
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.platform}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, platform: e.target.value },
                        })
                      }
                      placeholder="Ex: GitHub, LinkedIn, Twitter"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      URL de Acesso
                    </label>
                    <input
                      type="text"
                      value={editingItem.values.url}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, url: e.target.value },
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Ícone
                    </label>
                    <select
                      value={editingItem.values.icon}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          values: { ...editingItem.values, icon: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white"
                    >
                      {ICON_OPTIONS.map((ico) => (
                        <option key={ico} value={ico}>
                          {ico}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      <ProfileModal
        open={profileModalOpen}
        profile={data.profile}
        saving={saving}
        onClose={() => setProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
