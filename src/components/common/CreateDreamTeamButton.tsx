"use client";

import { Plus, RefreshCw } from "lucide-react";

interface CreateDreamTeamButtonProps {
  onClick: () => void;
  disabled: boolean;
  filledSlots: number;
  totalSlots: number;
  isUpdate?: boolean;
}

export function CreateDreamTeamButton({
  onClick,
  disabled,
  filledSlots,
  totalSlots,
  isUpdate = false,
}: CreateDreamTeamButtonProps) {
  const isComplete = filledSlots === totalSlots && totalSlots > 0;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full py-4 px-6 rounded-xl border-none cursor-pointer overflow-hidden
        transition-all duration-300 group
        ${
          disabled
            ? "bg-[rgba(36,39,35,0.6)] text-[rgba(252,252,248,0.2)] cursor-not-allowed"
            : "bg-gradient-to-br from-[#00ff66] to-[#00cc52] text-[#0a0b09] shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
        }
      `}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />

      <div className="relative flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div
            className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${disabled ? "bg-white/5" : "bg-black/10"}
          `}
          >
            {isUpdate ? (
              <RefreshCw
                className={`w-4 h-4 ${disabled ? "opacity-20" : "animate-spin-slow"}`}
              />
            ) : (
              <Plus className={`w-5 h-5 ${disabled ? "opacity-20" : ""}`} />
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-[Bebas_Neue,sans-serif] text-[18px] tracking-[0.02em] leading-none uppercase">
              {isUpdate ? "Update Squad" : "Finalize Dream Team"}
            </span>
            <span
              className={`text-[9px] font-bold tracking-[0.1em] uppercase ${disabled ? "text-white/20" : "text-black/50"}`}
            >
              {isComplete
                ? "Squad is Ready"
                : `Assigned: ${filledSlots} / ${totalSlots}`}
            </span>
          </div>
        </div>

        {!disabled && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-black/20 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-black/20 animate-pulse [animation-delay:200ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-black/20 animate-pulse [animation-delay:400ms]" />
          </div>
        )}
      </div>
    </button>
  );
}
