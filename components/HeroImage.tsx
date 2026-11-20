"use client";

import { useCallback, useState } from "react";
import { Modal } from "./Modal";
import { getAvatarImageUrl, getAvatarSrcSet, getFullAvatarImageUrl } from "@/lib/media";

interface HeroImageProps {
  src: string;
  alt: string;
}

const BASE_SIZE = 128;
const AVATAR_SIZES = "(min-width: 640px) 176px, 128px";

export function HeroImage({ src, alt }: HeroImageProps) {
  const [open, setOpen] = useState(false);
  const closeImage = useCallback(() => setOpen(false), []);
  const srcSet = getAvatarSrcSet(src, [BASE_SIZE, 176, 256, 352]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ampliar foto de perfil"
        title="Ampliar foto de perfil"
        className="relative block cursor-zoom-in rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getAvatarImageUrl(src, BASE_SIZE)}
          srcSet={srcSet}
          sizes={srcSet ? AVATAR_SIZES : undefined}
          alt={alt}
          width={BASE_SIZE}
          height={BASE_SIZE}
          fetchPriority="high"
          decoding="async"
          className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover object-top border-4 border-zinc-900 shadow-2xl"
        />
      </button>

      <Modal open={open} onClose={closeImage} title="Foto de perfil" wide>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getFullAvatarImageUrl(src)}
          alt={alt}
          className="mx-auto max-h-[70vh] w-auto max-w-full rounded-2xl border border-zinc-800 object-contain"
        />
      </Modal>
    </>
  );
}
