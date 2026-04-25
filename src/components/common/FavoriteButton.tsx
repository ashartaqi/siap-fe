interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
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
            ? "text-[#ffd700] border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.08)] hover:bg-[rgba(255,80,80,0.1)] hover:border-[rgba(255,80,80,0.35)] hover:text-[rgba(255,80,80,0.9)]"
            : "text-[rgba(255,255,255,0.5)] border-[rgba(71,72,69,0.4)] bg-transparent hover:text-[#ffd700] hover:border-[rgba(255,215,0,0.35)] hover:bg-[rgba(255,215,0,0.06)]"
        }
      `}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}
