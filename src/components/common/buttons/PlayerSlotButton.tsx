"use client";

import { useState } from "react";
import Image from "next/image";
import { PlusIcon } from "lucide-react";

interface PlayerSlotButtonProps {
  position: string;
  isGK?: boolean;
  onClick?: () => void;
  playerFaceUrl?: string;
  playerName?: string;
}

export function PlayerSlotButton({
  position,
  isGK = false,
  onClick,
  playerFaceUrl,
  playerName,
}: PlayerSlotButtonProps) {
  const [imgError, setImgError] = useState(false);
  const hasImage = !!playerFaceUrl && !imgError;
  const hasPlayer = !!playerName;

  return (
    <button
      onClick={() => onClick?.()}
      type="button"
      className={`
        relative flex items-center justify-center
        w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[72px] md:h-[72px]
        rounded-lg md:rounded-xl overflow-hidden
        border transition-all duration-200
        ${
          hasImage
            ? "border-[var(--color-neon)]/35 shadow-[0_0_14px_rgba(var(--color-neon-rgb),0.15)]"
            : hasPlayer
              ? "border-[var(--color-neon)]/20 shadow-[0_0_8px_rgba(var(--color-neon-rgb),0.08)]"
              : "border-white/15 hover:border-[var(--color-neon)]/40"
        }
        bg-[rgba(20,22,19,0.9)]
        hover:scale-[1.05] active:scale-[0.97]
      `}
    >
      {hasImage && (
        <Image
          src={playerFaceUrl}
          alt={playerName ?? position}
          unoptimized
          loading="eager"
          fill
          className="object-cover object-top"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      )}

      {hasImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      )}

      {!hasImage && (
        <div className="flex flex-col items-center justify-center gap-1 text-center px-1">
          {hasPlayer ? (
            <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.05em] uppercase text-[#fcfcf8] leading-tight text-center line-clamp-2">
              {playerName}
            </span>
          ) : (
            <span
              className={`text-[18px] ${
                isGK ? "text-[var(--color-neon)]" : "text-white/50"
              }`}
            >
              <PlusIcon />
            </span>
          )}
        </div>
      )}

      <div
        className={`
          absolute bottom-0 left-0 right-0
          text-[6px] md:text-[7px] font-bold tracking-[0.18em] uppercase text-center py-[1px] md:py-[2px]
          backdrop-blur-[2px]
          ${
            isGK
              ? "text-[var(--color-neon)] bg-[var(--color-neon)]/15"
              : "text-white bg-black/55"
          }
        `}
      >
        {position}
      </div>
    </button>
  );
}
