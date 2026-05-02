"use client";

import { useState, useMemo, useEffect } from "react";
import { GetOptimizedTeamButton } from "@/components/common/buttons/GetOptimizedTeamButton";
import {
  useCreateDreamTeam,
  useGetDreamTeam,
  useDeleteDreamTeam,
  useUpdateDreamTeam,
  useGetOptimizedDreamTeam,
} from "@/features/main/dashboard";
import { IPlayersResponse } from "@/features/main/dashboard";
import { PlayerPickerModal } from "@/components/common/modals/PlayerPickerModal";
import { useGetFormations } from "@/features/main/football";
import { Pitch } from "@/components/ui/dream-team/Pitch";
import { FormationPicker } from "@/components/ui/dream-team/FormationPicker";
import { SquadAnalysis } from "@/components/ui/dream-team/SquadAnalysis";
import { SquadActions } from "@/components/ui/dream-team/SquadActions";
import { Toast } from "@/components/common/Toast";
import type { SelectedPlayers } from "@/features/main/dashboard/types";

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "blue";
}

export default function DreamTeamPage() {
  const [activeId, setActiveId] = useState<string>("4-4-2");
  const [pickerSlot, setPickerSlot] = useState<{
    id: string;
    pos: string;
  } | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayers>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const { data: formations = [], isLoading: formationsLoading } =
    useGetFormations();

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ message, type });
  };

  const { mutate: createDreamTeam, isPending: isCreating } =
    useCreateDreamTeam();
  const { mutate: updateDreamTeam, isPending: isUpdating } =
    useUpdateDreamTeam();
  const { data: existingTeam, isLoading: teamLoading } = useGetDreamTeam();
  const { mutate: deleteDreamTeam, isPending: isDeleting } =
    useDeleteDreamTeam();
  const { mutate: getOptimizedTeam, isPending: isOptimizing } =
    useGetOptimizedDreamTeam();

  useEffect(() => {
    // ── Initializing from Saved Team ───────────────────────────────────
    if (existingTeam && !isInitialized) {
      const timer = setTimeout(() => {
        setActiveId(existingTeam.formation);
        const players: SelectedPlayers = {};
        existingTeam.slots.forEach((slot) => {
          if (slot.player) {
            const slotId =
              slot.position === "GK"
                ? "GK"
                : `r${slot.row}-c${slot.col}-${slot.position}`;
            players[slotId] = slot.player;
          }
        });
        setSelectedPlayers(players);
        setIsInitialized(true);
        setIsEditing(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // ── Handle Team Deletion ───────────────────────────────────────────
    if (!existingTeam && isInitialized) {
      const timer = setTimeout(() => {
        setIsInitialized(false);
        setIsEditing(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    // ── Default State for New Team ──────────────────────────────────────
    if (!existingTeam && !isInitialized && formations.length > 0) {
      const timer = setTimeout(() => {
        setIsEditing(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [existingTeam, isInitialized, formations]);

  const active = formations.find((f) => f.id === activeId) ?? formations[0];

  const totalSlots = useMemo(
    () => (active ? active.rows.reduce((s, r) => s + r.length, 0) + 1 : 0),
    [active],
  );
  const filledSlots = Object.values(selectedPlayers).filter(Boolean).length;
  const isComplete = filledSlots === totalSlots && totalSlots > 0;

  const usedPlayerIds = useMemo(() => {
    const ids = new Set<number>();
    Object.entries(selectedPlayers).forEach(([slotId, p]) => {
      if (p && slotId !== pickerSlot?.id) ids.add(p.id);
    });
    return ids;
  }, [selectedPlayers, pickerSlot]);

  const isDirty = useMemo(() => {
    if (!existingTeam) return filledSlots > 0;
    if (activeId !== existingTeam.formation) return true;

    const currentSlotPlayers = new Map<string, number>();
    Object.entries(selectedPlayers).forEach(([id, p]) => {
      if (p) currentSlotPlayers.set(id, p.id);
    });

    const existingSlotPlayers = new Map<string, number>();
    existingTeam.slots.forEach((slot) => {
      if (slot.player) {
        const slotId =
          slot.position === "GK"
            ? "GK"
            : `r${slot.row}-c${slot.col}-${slot.position}`;
        existingSlotPlayers.set(slotId, slot.player.id);
      }
    });

    if (currentSlotPlayers.size !== existingSlotPlayers.size) return true;
    for (const [id, playerId] of currentSlotPlayers) {
      if (existingSlotPlayers.get(id) !== playerId) return true;
    }
    return false;
  }, [selectedPlayers, activeId, existingTeam, filledSlots]);

  const handleSlotClick = (id: string, pos: string) => {
    if (!isEditing) {
      showToast("Click 'Update Squad' to edit", "info");
      return;
    }
    setPickerSlot({ id, pos });
  };

  const handlePlayerSelect = (player: IPlayersResponse) => {
    if (!pickerSlot) return;
    setSelectedPlayers((prev) => ({ ...prev, [pickerSlot.id]: player }));
    setPickerSlot(null);
  };

  const handleGetOptimizedTeam = () => {
    getOptimizedTeam(activeId, {
      onSuccess: (data) => {
        const players: SelectedPlayers = {};
        data.slots.forEach((slot) => {
          if (slot.player) {
            const slotId =
              slot.position === "GK"
                ? "GK"
                : `r${slot.row}-c${slot.col}-${slot.position}`;
            players[slotId] = slot.player;
          }
        });
        setSelectedPlayers(players);
        showToast("Squad optimized based on player ratings!", "blue");
      },
      onError: () => {
        showToast("Failed to optimize squad", "error");
      },
    });
  };

  const getPayloadSlots = () => {
    return Object.entries(selectedPlayers)
      .filter(([, p]) => p)
      .map(([slotId, player]) => {
        if (slotId === "GK") {
          return {
            position: "GK",
            row: null,
            col: null,
            player_id: player!.id,
          };
        }
        const parts = slotId.split("-");
        const row = parseInt(parts[0].replace("r", ""));
        const col = parseInt(parts[1].replace("c", ""));
        const position = parts[2];
        return { position, row, col, player_id: player!.id };
      });
  };

  const handleCreate = () => {
    createDreamTeam(
      { formation: activeId, slots: getPayloadSlots() },
      {
        onSuccess: () => {
          showToast("Dream Team created successfully!", "success");
          setIsEditing(false);
        },
        onError: () => showToast("Failed to create Dream Team", "error"),
      },
    );
  };

  const handleUpdate = () => {
    updateDreamTeam(
      { formation: activeId, slots: getPayloadSlots() },
      {
        onSuccess: () => {
          showToast("Dream Team updated successfully!", "success");
          setIsEditing(false);
        },
        onError: () => showToast("Failed to update Dream Team", "error"),
      },
    );
  };

  const handleEnterEditMode = () => {
    setIsEditing(true);
    showToast("Editing Enabled", "info");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your Dream Team?")) {
      deleteDreamTeam(undefined, {
        onSuccess: () => {
          showToast("Dream Team deleted", "success");
          setSelectedPlayers({});
          setIsInitialized(false);
        },
        onError: () => showToast("Failed to delete team", "error"),
      });
    }
  };

  if (formationsLoading || teamLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[60vh] font-[Oxanium,sans-serif] text-[#fcfcf8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[rgba(0,255,102,0.2)] border-t-[#00ff66] rounded-full animate-spin" />
          <span className="text-[12px] font-bold tracking-[0.24em] uppercase text-[#aaaba7]">
            Loading Dream Team…
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-5 w-full h-full font-[Oxanium,sans-serif] text-[#fcfcf8] pb-10 lg:pb-0">
        <div className="flex flex-col gap-5 lg:w-1/3 lg:shrink-0">
          <div>
            <h1 className="font-[Bebas_Neue,sans-serif] text-[36px] md:text-[42px] leading-[0.92] tracking-[-0.01em] uppercase">
              {existingTeam ? "YOUR DREAM TEAM" : "DREAM TEAM"}
            </h1>
            <p className="text-[11px] md:text-[12px] text-[#aaaba7] leading-[1.4] mt-[5px] max-w-[280px]">
              {existingTeam
                ? "Update your formation and players below."
                : "Assemble your ideal team and rise to the top."}
            </p>
          </div>

          {existingTeam && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(0,255,102,0.04)] border border-[rgba(0,255,102,0.15)]">
              <div>
                <span className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#aaaba7] mb-1">
                  Total Score
                </span>
                <span className="font-[Bebas_Neue,sans-serif] text-[36px] leading-none text-[#00ff66]">
                  {existingTeam.total_score}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#aaaba7] mb-1">
                  Formation
                </span>
                <span className="inline-block px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#fcfcf8] text-[12px] font-bold tracking-[0.1em]">
                  {existingTeam.formation}
                </span>
              </div>
            </div>
          )}

          <FormationPicker
            activeId={activeId}
            formations={formations}
            onSelect={(id) => {
              if (!isEditing) {
                showToast("Click 'Update Squad' to change formation", "info");
                return;
              }
              setActiveId(id);
              setSelectedPlayers({});
            }}
          />

          <GetOptimizedTeamButton
            onClick={handleGetOptimizedTeam}
            isLoading={isOptimizing}
          />

          {active && (
            <SquadAnalysis
              selectedPlayers={selectedPlayers}
              tacticalFit={active.tacticalFit}
              filledSlots={filledSlots}
              totalSlots={totalSlots}
              isComplete={isComplete}
            />
          )}

          <SquadActions
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isCreatePending={isCreating}
            isUpdatePending={isUpdating}
            isDeletePending={isDeleting}
            isComplete={isComplete}
            hasExistingTeam={!!existingTeam}
            isDirty={isDirty}
            isEditing={isEditing}
            onEnterEditMode={handleEnterEditMode}
            filledSlots={filledSlots}
            totalSlots={totalSlots}
          />
        </div>

        {active && (
          <Pitch
            key={activeId}
            formation={active}
            onSlotClick={handleSlotClick}
            selectedPlayers={selectedPlayers}
          />
        )}
      </div>

      {pickerSlot && (
        <PlayerPickerModal
          label={pickerSlot.pos}
          isGK={pickerSlot.pos === "GK"}
          onClose={() => setPickerSlot(null)}
          onSelect={handlePlayerSelect}
          usedPlayerIds={usedPlayerIds}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
