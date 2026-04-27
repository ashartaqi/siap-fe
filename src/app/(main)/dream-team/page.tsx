"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useCreateDreamTeam,
  useGetDreamTeam,
  useDeleteDreamTeam,
  useUpdateDreamTeam,
} from "@/features/main/dashboard";
import { IPlayersResponse } from "@/features/main/dashboard";
import { PlayerPickerModal } from "@/components/common/PlayerPickerModal";
import { useGetFormations } from "@/features/main/football";
import { Pitch } from "@/components/ui/dream-team/Pitch";
import { FormationPicker } from "@/components/ui/dream-team/FormationPicker";
import { SquadAnalysis } from "@/components/ui/dream-team/SquadAnalysis";
import { Toast } from "@/components/common/Toast";
import { SquadActions } from "@/components/ui/dream-team/SquadActions";
import type { SelectedPlayers } from "@/types/dreamTeam";

type ToastState = { message: string; type: "success" | "error" | "info" };

export default function DreamTeamPage() {
  const [activeId, setActiveId] = useState<string>("4-4-2");
  const [pickerSlot, setPickerSlot] = useState<{
    id: string;
    pos: string;
  } | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayers>({});
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState["type"] = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: formations = [], isLoading: formationsLoading } =
    useGetFormations();
  const { mutate: createDreamTeam, isPending: isCreating } =
    useCreateDreamTeam();
  const { mutate: updateDreamTeam, isPending: isUpdating } =
    useUpdateDreamTeam();
  const { data: existingTeam, isLoading: teamLoading } = useGetDreamTeam();
  const { mutate: deleteDreamTeam, isPending: isDeleting } =
    useDeleteDreamTeam();

  useEffect(() => {
    if (existingTeam && !isEditing) {
      // Use setTimeout to avoid cascading render warning from ESLint
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
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [existingTeam, isEditing]);

  const active = formations.find((f) => f.id === activeId) ?? formations[0];

  const totalSlots = useMemo(
    () => (active ? active.rows.reduce((s, r) => s + r.length, 0) + 1 : 0),
    [active],
  );
  const filledSlots = Object.values(selectedPlayers).filter(Boolean).length;
  const isComplete = filledSlots === totalSlots && totalSlots > 0;
  const remainingSlots = totalSlots - filledSlots;

  const usedPlayerIds = useMemo(() => {
    const ids = new Set<number>();
    Object.entries(selectedPlayers).forEach(([slotId, p]) => {
      if (p && slotId !== pickerSlot?.id) ids.add(p.id);
    });
    return ids;
  }, [selectedPlayers, pickerSlot]);

  const handleSlotClick = (id: string, pos: string) => {
    if (existingTeam && !isEditing) {
      showToast("Click 'Update' to enter edit mode", "info");
      return;
    }
    setPickerSlot({ id, pos });
  };

  const handlePlayerSelect = (player: IPlayersResponse) => {
    if (!pickerSlot) return;
    setSelectedPlayers((prev) => ({ ...prev, [pickerSlot.id]: player }));
    setPickerSlot(null);
  };

  const getSlotPayload = () => {
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
    if (!isComplete) return;
    createDreamTeam(
      { formation: activeId, slots: getSlotPayload() },
      {
        onSuccess: () => {
          showToast("Dream Team created successfully!");
          setIsEditing(false);
        },
        onError: () => showToast("Failed to create Dream Team", "error"),
      },
    );
  };

  const handleUpdate = () => {
    if (!existingTeam) return;

    if (!isEditing) {
      setIsEditing(true);
      showToast(
        "Edit mode active. Make your changes and click Update again.",
        "info",
      );
      return;
    }

    if (!isComplete) {
      showToast("Squad must be complete to update", "error");
      return;
    }

    updateDreamTeam(
      { formation: activeId, slots: getSlotPayload() },
      {
        onSuccess: () => {
          showToast("Dream Team updated successfully!");
          setIsEditing(false);
        },
        onError: () => showToast("Failed to update Dream Team", "error"),
      },
    );
  };

  const handleDelete = () => {
    if (!existingTeam) return;
    deleteDreamTeam(undefined, {
      onSuccess: () => {
        showToast("Dream Team deleted", "success");
        setSelectedPlayers({});
        setIsInitialized(false);
        setIsEditing(false);
      },
      onError: () => showToast("Failed to delete Dream Team", "error"),
    });
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-5 w-full h-full font-[Oxanium,sans-serif] text-[#fcfcf8] pb-10 lg:pb-0">
        <div className="flex flex-col gap-5 lg:w-1/3 lg:shrink-0">
          <div>
            <h1 className="font-[Bebas_Neue,sans-serif] text-[36px] md:text-[42px] leading-[0.92] tracking-[-0.01em] uppercase">
              {existingTeam
                ? isEditing
                  ? "EDITING SQUAD"
                  : "YOUR DREAM TEAM"
                : "DREAM TEAM"}
            </h1>
            <p className="text-[11px] md:text-[12px] text-[#aaaba7] leading-[1.4] mt-[5px] max-w-[280px]">
              {existingTeam
                ? isEditing
                  ? "Make your changes and click update to save."
                  : "Update your formation and players below."
                : "Assemble your ideal team and rise to the top."}
            </p>
          </div>

          {existingTeam && (
            <div
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${isEditing ? "bg-[rgba(0,196,255,0.04)] border-[rgba(0,196,255,0.2)] shadow-[0_0_20px_rgba(0,196,255,0.05)]" : "bg-[rgba(0,255,102,0.04)] border-[rgba(0,255,102,0.15)]"}`}
            >
              <div>
                <span className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#aaaba7] mb-1">
                  Total Score
                </span>
                <span
                  className={`font-[Bebas_Neue,sans-serif] text-[36px] leading-none transition-colors duration-300 ${isEditing ? "text-[#00c4ff]" : "text-[#00ff66]"}`}
                >
                  {existingTeam.total_score}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#aaaba7] mb-1">
                  Formation
                </span>
                <span
                  className={`inline-block px-2 py-1 rounded border text-[12px] font-bold tracking-[0.1em] transition-all duration-300 ${isEditing ? "bg-[rgba(0,196,255,0.1)] border-[rgba(0,196,255,0.3)] text-[#00c4ff]" : "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#fcfcf8]"}`}
                >
                  {activeId}
                </span>
              </div>
            </div>
          )}

          <FormationPicker
            activeId={activeId}
            formations={formations}
            onSelect={(id) => {
              if (existingTeam && !isEditing) {
                showToast("Enter edit mode to change formation", "info");
                return;
              }
              setActiveId(id);
              setSelectedPlayers({});
            }}
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
            hasExistingTeam={!!existingTeam}
            isComplete={isComplete}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            remainingSlots={remainingSlots}
            isEditing={isEditing}
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
    </>
  );
}
