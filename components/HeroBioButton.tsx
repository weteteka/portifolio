"use client";

import { useCallback, useState } from "react";
import { Eye } from "lucide-react";
import { Modal } from "./Modal";

interface HeroBioButtonProps {
  bio: string;
}

export function HeroBioButton({ bio }: HeroBioButtonProps) {
  const [open, setOpen] = useState(false);
  const closeBio = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
      >
        <Eye className="w-4 h-4 shrink-0" />
        <span>Visualizar sobre mim</span>
      </button>

      <Modal open={open} onClose={closeBio} title="Sobre mim">
        <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-zinc-300">
          {bio}
        </p>
      </Modal>
    </>
  );
}
