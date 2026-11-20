"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Send, ArrowRight } from "lucide-react";
import { siteNavLinks } from "@/lib/site-nav";

interface NavbarProps {
  name: string;
  role: string;
}

export function Navbar({ name }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = siteNavLinks.map(({ label, href }) => ({ label, href }));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        scrolled
          ? "bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 shadow-lg shadow-black/30 py-2.5 sm:py-3"
          : "bg-zinc-950/40 backdrop-blur-sm sm:bg-transparent py-3 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-3">
          {/* Logo / Brand */}
          <Link href="/" className="group flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              {name ? name.charAt(0) : "P"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white font-bold tracking-tight text-sm sm:text-base md:text-lg group-hover:text-emerald-400 transition-colors truncate max-w-[140px] sm:max-w-[200px] md:max-w-none">
                {name}
              </span>
              <span className="text-[10px] sm:text-xs text-zinc-400 font-mono truncate">
                Portfólio & CV
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1 bg-zinc-900/70 border border-zinc-800/80 rounded-full px-4 py-1.5 backdrop-blur-sm shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                  pathname === link.href
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <Link
              href="/contato"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl px-3.5 py-2 shadow-sm shadow-emerald-600/30 transition-all hover:shadow-emerald-600/50 hover:-translate-y-0.5"
            >
              <span>Falar Comigo</span>
              <Send className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>

          {/* Mobile Right Controls (< 640px) */}
          <div className="flex items-center gap-2 xl:hidden shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              aria-label="Menu principal"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Accessible on mobile & tablet) */}
      {isOpen && (
        <div className="xl:hidden bg-zinc-950/98 border-b border-zinc-800/90 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 mt-2 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border transition-colors text-center ${
                  pathname === link.href
                    ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400"
                    : "text-zinc-200 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2.5">
            <Link
              href="/contato"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-500 shadow-md"
            >
              <span>Entrar em Contato</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
