import React from "react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
  return (
    <button
      onClick={onClick}
      title={isFavorite ? "Remove from favourites" : "Add to favourites"}
      className={`
        absolute top-3 right-3 z-10
        w-7 h-7 flex items-center justify-center rounded-full
        border transition-all duration-200 text-[15px] leading-none
          ${
            isFavorite
              ? "text-[var(--color-neon)] border-[var(--color-neon)]/35 bg-[var(--color-neon)]/8 hover:bg-[rgba(255,80,80,0.1)] hover:border-[rgba(255,80,80,0.35)] hover:text-[rgba(255,80,80,0.9)]"
              : "text-white/50 border-[var(--color-border)] bg-transparent hover:text-[var(--color-neon)] hover:border-[var(--color-neon)]/35 hover:bg-[var(--color-neon)]/6"
          }
      `}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}
