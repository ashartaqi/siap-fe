"use client";

import { Plus, RefreshCw, Trash2, Lock } from "lucide-react";

interface SquadActionsProps {
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  hasExistingTeam: boolean;
  isComplete: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  remainingSlots: number;
  isEditing: boolean;
}

export function SquadActions({
  onCreate,
  onUpdate,
  onDelete,
  hasExistingTeam,
  isComplete,
  isCreating,
  isUpdating,
  isDeleting,
  remainingSlots,
  isEditing,
}: SquadActionsProps) {
  return (
    <div className="flex flex-col gap-3 w-full mt-4">
      {/* Create Button */}
      <button
        onClick={onCreate}
        disabled={hasExistingTeam || !isComplete || isCreating}
        className={`
          relative group flex items-center justify-between px-5 py-3.5 rounded-xl border transition-all duration-300
          ${
            hasExistingTeam
              ? "bg-[rgba(36,39,35,0.4)] border-[rgba(71,72,69,0.2)] text-white/10 grayscale cursor-not-allowed opacity-50"
              : !isComplete
                ? "bg-[rgba(0,255,102,0.02)] border-[rgba(0,255,102,0.1)] text-[#00ff66]/30 cursor-not-allowed"
                : "bg-[rgba(0,255,102,0.06)] border-[rgba(0,255,102,0.3)] text-[#00ff66] hover:bg-[rgba(0,255,102,0.12)] hover:border-[rgba(0,255,102,0.6)] hover:shadow-[0_0_25px_rgba(0,255,102,0.15)] active:scale-[0.98] cursor-pointer"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${hasExistingTeam ? "bg-white/5" : "bg-[#00ff66]/10"}`}
          >
            {hasExistingTeam ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-[Bebas_Neue,sans-serif] text-[18px] tracking-[0.05em] leading-none">
              Create Squad
            </span>
            {!hasExistingTeam && remainingSlots > 0 && (
              <span className="text-[9px] font-bold tracking-widest text-[#00ff66]/50 uppercase mt-1">
                {remainingSlots} slots left
              </span>
            )}
          </div>
        </div>
        {isCreating && (
          <div className="w-4 h-4 border-2 border-t-transparent border-[#00ff66] rounded-full animate-spin" />
        )}
      </button>

      <div className="grid grid-cols-2 gap-3">
        {/* Update Button */}
        <button
          onClick={onUpdate}
          disabled={
            !hasExistingTeam || (isEditing && !isComplete) || isUpdating
          }
          className={`
            relative group flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border transition-all duration-300
            ${
              !hasExistingTeam
                ? "bg-[rgba(36,39,35,0.4)] border-[rgba(71,72,69,0.2)] text-white/10 grayscale cursor-not-allowed opacity-50"
                : isEditing
                  ? !isComplete
                    ? "bg-[rgba(0,196,255,0.02)] border-[rgba(0,196,255,0.1)] text-[#00c4ff]/30 cursor-not-allowed"
                    : "bg-[rgba(0,196,255,0.12)] border-[#00c4ff] text-[#00c4ff] shadow-[0_0_25px_rgba(0,196,255,0.2)] animate-pulse cursor-pointer"
                  : !isComplete
                    ? "bg-[rgba(0,196,255,0.02)] border-[rgba(0,196,255,0.1)] text-[#00c4ff]/30 cursor-not-allowed"
                    : "bg-[rgba(0,196,255,0.06)] border-[rgba(0,196,255,0.3)] text-[#00c4ff] hover:bg-[rgba(0,196,255,0.12)] hover:border-[rgba(0,196,255,0.6)] hover:shadow-[0_0_25px_rgba(0,196,255,0.15)] active:scale-[0.98] cursor-pointer"
            }
          `}
        >
          {!hasExistingTeam ? (
            <Lock className="w-5 h-5 mb-1" />
          ) : isUpdating ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-[#00c4ff] rounded-full animate-spin" />
          ) : (
            <RefreshCw
              className={`w-5 h-5 ${isEditing ? "animate-spin-slow" : "group-hover:rotate-180 transition-transform duration-500"}`}
            />
          )}
          <span className="font-[Bebas_Neue,sans-serif] text-[15px] tracking-[0.05em] uppercase">
            {isEditing ? "Save" : "Update"}
          </span>
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          disabled={!hasExistingTeam || isDeleting}
          className={`
            relative group flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border transition-all duration-300
            ${
              !hasExistingTeam
                ? "bg-[rgba(36,39,35,0.4)] border-[rgba(71,72,69,0.2)] text-white/10 grayscale cursor-not-allowed opacity-50"
                : "bg-[rgba(255,60,60,0.06)] border-[rgba(255,60,60,0.3)] text-[#ff3c3c] hover:bg-[rgba(255,60,60,0.12)] hover:border-[rgba(255,60,60,0.6)] hover:shadow-[0_0_25px_rgba(255,60,60,0.15)] active:scale-[0.98] cursor-pointer"
            }
          `}
        >
          {!hasExistingTeam ? (
            <Lock className="w-5 h-5 mb-1" />
          ) : isDeleting ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-[#ff3c3c] rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
          <span className="font-[Bebas_Neue,sans-serif] text-[15px] tracking-[0.05em] uppercase">
            Delete
          </span>
        </button>
      </div>
    </div>
  );
}
