"use client";

import { useState, useMemo } from "react";
import { CreateDreamTeamButton } from "@/components/common/Button";
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

  const { data: formations = [], isLoading: formationsLoading } =
    useGetFormations();

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

  const handleCreateDreamTeam = () => {
    const squad = Object.entries(selectedPlayers)
      .filter(([, p]) => p)
      .map(([slotId, player]) => ({ slotId, player }));
    console.log("Dream Team:", squad);
  };

  if (formationsLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="flex items-center gap-2">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 rounded-full bg-[#00ff66] animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-start gap-5 w-full h-full font-[Oxanium,sans-serif] text-[#fcfcf8]">
        <div className="flex flex-col gap-3 lg:w-1/3 lg:shrink-0">
          <div>
            <h1 className="font-[Bebas_Neue,sans-serif] text-[42px] leading-[0.92] tracking-[-0.01em] uppercase">
              DREAM TEAM
            </h1>
            <p className="text-[12px] text-[#aaaba7] leading-[1.4] mt-[5px] max-w-[280px]">
              Assemble your ideal team and rise to the top.
            </p>
          </div>

          <FormationPicker
            activeId={activeId}
            formations={formations}
            onSelect={(id) => {
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

          <CreateDreamTeamButton
            onClick={handleCreateDreamTeam}
            disabled={!isComplete}
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
    </>
  );
}
