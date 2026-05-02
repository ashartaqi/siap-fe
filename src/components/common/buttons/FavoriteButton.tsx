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
            ? "text-[#00ff66] border-[rgba(0,255,102,0.35)] bg-[rgba(0,255,102,0.08)] hover:bg-[rgba(255,80,80,0.1)] hover:border-[rgba(255,80,80,0.35)] hover:text-[rgba(255,80,80,0.9)]"
            : "text-[rgba(255,255,255,0.5)] border-[rgba(71,72,69,0.4)] bg-transparent hover:text-[#00ff66] hover:border-[rgba(0,255,102,0.35)] hover:bg-[rgba(0,255,102,0.06)]"
        }
      `}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}
