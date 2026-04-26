"use client";

import { useState, useMemo, useEffect } from "react";
import { CreateDreamTeamButton } from "@/components/common/CreateDreamTeamButton";
import { GetOptimizedTeamButton } from "@/components/common/GetOptimizedTeamButton";
import {
  useCreateDreamTeam,
  useGetDreamTeam,
  useDeleteDreamTeam,
  useUpdateDreamTeam,
  useGetOptimizedDreamTeam,
} from "@/features/main/dashboard";
import { IPlayersResponse } from "@/features/main/dashboard";
import { PlayerPickerModal } from "@/components/common/PlayerPickerModal";
import { useGetFormations } from "@/features/main/football";
import { Pitch } from "@/components/ui/dream-team/Pitch";
import { FormationPicker } from "@/components/ui/dream-team/FormationPicker";
import { SquadAnalysis } from "@/components/ui/dream-team/SquadAnalysis";
import type { SelectedPlayers } from "@/types/dreamTeam";

export default function DreamTeamPage() {
  const [activeId, setActiveId] = useState<string>("4-4-2");
  const [pickerSlot, setPickerSlot] = useState<{
    id: string;
    pos: string;
  } | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayers>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: formations = [], isLoading: formationsLoading } =
    useGetFormations();
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
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [existingTeam, isInitialized]);

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

  const handleSlotClick = (id: string, pos: string) =>
    setPickerSlot({ id, pos });

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
      },
    });
  };

  const handleCreateOrUpdate = () => {
    const slots = Object.entries(selectedPlayers)
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

    if (existingTeam) {
      updateDreamTeam({ formation: activeId, slots });
    } else {
      createDreamTeam({ formation: activeId, slots });
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

          <CreateDreamTeamButton
            onClick={handleCreateOrUpdate}
            disabled={!isComplete || isCreating || isUpdating}
            filledSlots={filledSlots}
            totalSlots={totalSlots}
            isUpdate={!!existingTeam}
          />

          {existingTeam && (
            <button
              type="button"
              onClick={() => deleteDreamTeam()}
              disabled={isDeleting}
              className={[
                "mt-2 relative w-full py-3 px-5 rounded-lg border text-[14px] font-bold tracking-[0.1em] uppercase",
                "font-[Bebas_Neue,sans-serif] transition-all duration-200 overflow-hidden",
                isDeleting
                  ? "border-[rgba(71,72,69,0.2)] bg-[rgba(36,39,35,0.4)] text-white/20 cursor-not-allowed"
                  : "border-[rgba(255,60,60,0.35)] bg-[rgba(255,60,60,0.06)] text-[#ff3c3c] hover:bg-[rgba(255,60,60,0.12)] hover:border-[rgba(255,60,60,0.6)] hover:shadow-[0_0_20px_rgba(255,60,60,0.12)] active:scale-[0.98] cursor-pointer",
              ].join(" ")}
            >
              {isDeleting ? "Deleting…" : "Delete Dream Team"}
            </button>
          )}
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
