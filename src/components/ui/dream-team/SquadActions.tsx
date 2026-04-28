"use client";

import { Plus, RefreshCw, Trash2 } from "lucide-react";

interface SquadActionsProps {
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  isComplete: boolean;
  hasExistingTeam: boolean;
  isDirty: boolean;
  isEditing: boolean;
  onEnterEditMode: () => void;
  filledSlots: number;
  totalSlots: number;
}

export function SquadActions({
  onCreate,
  onUpdate,
  onDelete,
  isCreatePending,
  isUpdatePending,
  isDeletePending,
  isComplete,
  hasExistingTeam,
  isDirty,
  isEditing,
  onEnterEditMode,
  filledSlots,
  totalSlots,
}: SquadActionsProps) {
  const isPending = isCreatePending || isUpdatePending || isDeletePending;

  return (
    <div className="flex flex-col gap-3 w-full mt-4">
      <div className="relative overflow-hidden rounded-xl">
        {/* Animated Background for Save Mode */}
        {hasExistingTeam && isEditing && isDirty && isComplete && (
          <div className="absolute inset-0 bg-[#00ff66]/10 animate-pulse pointer-events-none" />
        )}

        <div className="flex gap-3 relative z-10">
          {!hasExistingTeam ? (
            <button
              onClick={onCreate}
              disabled={!isComplete || isPending}
              className={`
                flex-1 relative py-4 px-6 rounded-xl border-none cursor-pointer overflow-hidden
                transition-all duration-300 group
                ${
                  !isComplete || isPending
                    ? "bg-[rgba(36,39,35,0.6)] text-[rgba(252,252,248,0.2)] cursor-not-allowed"
                    : "bg-gradient-to-br from-[#00ff66] to-[#00cc52] text-[#0a0b09] shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] hover:-translate-y-0.5"
                }
              `}
            >
              <div className="relative flex items-center justify-center gap-3 z-10 font-[Bebas_Neue] text-xl tracking-wider">
                {isCreatePending ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>CREATE DREAM TEAM</span>
              </div>
            </button>
          ) : !isEditing ? (
            <button
              onClick={onEnterEditMode}
              disabled={isPending}
              className="flex-1 relative py-4 px-6 rounded-xl border border-[rgba(0,255,102,0.3)] bg-[rgba(0,255,102,0.05)] text-[#00ff66] font-[Bebas_Neue] text-xl tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,102,0.12)] hover:shadow-[0_0_20px_rgba(0,255,102,0.1)] active:scale-[0.98]"
            >
              <div className="relative flex items-center justify-center gap-3 z-10">
                <RefreshCw className="w-5 h-5" />
                <span>UPDATE SQUAD</span>
              </div>
            </button>
          ) : (
            <button
              onClick={onUpdate}
              disabled={!isComplete || isPending || !isDirty}
              className={`
                flex-[2] relative py-4 px-6 rounded-xl border-none cursor-pointer overflow-hidden
                transition-all duration-300 group
                ${
                  !isComplete || isPending || !isDirty
                    ? "bg-[rgba(36,39,35,0.6)] text-[rgba(252,252,248,0.2)] cursor-not-allowed"
                    : "bg-gradient-to-br from-[#00ff66] to-[#00cc52] text-[#0a0b09] shadow-[0_0_20px_rgba(0,255,102,0.4)] animate-in zoom-in-95 duration-300"
                }
              `}
            >
              <div className="relative flex items-center justify-center gap-3 z-10 font-[Bebas_Neue] text-xl tracking-wider">
                {isUpdatePending ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 animate-spin-slow" />
                )}
                <span>SAVE CHANGES</span>
              </div>
            </button>
          )}

          {hasExistingTeam && (
            <button
              onClick={onDelete}
              disabled={isPending}
              className={`
                ${isEditing ? "flex-1" : "w-16"} relative py-4 px-3 rounded-xl border border-[rgba(255,60,60,0.3)] 
                bg-[rgba(255,60,60,0.05)] text-[#ff3c3c] cursor-pointer overflow-hidden
                transition-all duration-300 hover:bg-[rgba(255,60,60,0.15)] hover:border-[#ff3c3c]
                disabled:opacity-20 disabled:cursor-not-allowed
              `}
            >
              <div className="relative flex items-center justify-center z-10">
                {isDeletePending ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-center text-white/30">
        {isComplete
          ? "Squad is complete and ready"
          : `Selection Progress: ${filledSlots} / ${totalSlots}`}
      </p>
    </div>
  );
}
