"use client";

interface GetOptimizedTeamButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export function GetOptimizedTeamButton({
  onClick,
  isLoading = false,
}: GetOptimizedTeamButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-disabled={isLoading}
      className={`
        relative w-full px-5 py-3 rounded-lg border text-[14px] font-bold tracking-[0.1em] uppercase
        font-[Bebas_Neue,sans-serif] transition-all duration-200 overflow-hidden
        ${
          isLoading
            ? "border-[rgba(71,72,69,0.2)] bg-[rgba(36,39,35,0.4)] text-white/20 cursor-not-allowed"
            : "border-[rgba(70,200,255,0.35)] bg-[rgba(70,200,255,0.06)] text-[#46c8ff] hover:bg-[rgba(70,200,255,0.12)] hover:border-[rgba(70,200,255,0.6)] hover:shadow-[0_0_20px_rgba(70,200,255,0.12)] active:scale-[0.98] cursor-pointer"
        }
      `}
    >
      {isLoading ? "Optimizing…" : "Get Optimized Team"}
    </button>
  );
}
