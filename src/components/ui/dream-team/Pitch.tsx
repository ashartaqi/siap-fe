"use client";

import { PlayerSlotButton } from "@/components/common/buttons/PlayerSlotButton";
import type {
  Formation,
  SelectedPlayers,
} from "@/features/main/dashboard/types";

interface PitchRowProps {
  positions: string[];
  rowIndex: number;
  onSlotClick: (slotId: string, pos: string) => void;
  selectedPlayers: SelectedPlayers;
}

function PitchRow({
  positions,
  rowIndex,
  onSlotClick,
  selectedPlayers,
}: PitchRowProps) {
  if (positions.length <= 3) {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-[56px]">
        {positions.map((pos, i) => {
          const slotId = `r${rowIndex}-c${i}-${pos}`;
          const player = selectedPlayers[slotId];
          return (
            <PlayerSlotButton
              key={slotId}
              position={pos}
              playerFaceUrl={player?.player_face_url}
              playerName={player?.short_name}
              onClick={() => onSlotClick(slotId, pos)}
            />
          );
        })}
      </div>
    );
  }

  const [left, ...rest] = positions;
  const right = rest[rest.length - 1];
  const inner = rest.slice(0, -1);
  const leftId = `r${rowIndex}-c0-${left}`;
  const rightId = `r${rowIndex}-c${positions.length - 1}-${right}`;

  return (
    <div className="flex items-center justify-between px-[6px]">
      <PlayerSlotButton
        position={left}
        playerFaceUrl={selectedPlayers[leftId]?.player_face_url}
        playerName={selectedPlayers[leftId]?.short_name}
        onClick={() => onSlotClick(leftId, left)}
      />
      <div className="flex gap-2 sm:gap-4 md:gap-10">
        {inner.map((pos, i) => {
          const slotId = `r${rowIndex}-c${i + 1}-${pos}`;
          const player = selectedPlayers[slotId];
          return (
            <PlayerSlotButton
              key={slotId}
              position={pos}
              playerFaceUrl={player?.player_face_url}
              playerName={player?.short_name}
              onClick={() => onSlotClick(slotId, pos)}
            />
          );
        })}
      </div>
      <PlayerSlotButton
        position={right}
        playerFaceUrl={selectedPlayers[rightId]?.player_face_url}
        playerName={selectedPlayers[rightId]?.short_name}
        onClick={() => onSlotClick(rightId, right)}
      />
    </div>
  );
}

interface Props {
  formation: Formation;
  onSlotClick: (slotId: string, pos: string) => void;
  selectedPlayers: SelectedPlayers;
}

export function Pitch({ formation, onSlotClick, selectedPlayers }: Props) {
  const gkPlayer = selectedPlayers["GK"];

  return (
    <section className="flex-1 min-w-0">
      <div className="relative w-full aspect-[3/4] bg-[radial-gradient(circle_at_center,var(--color-surface)_0%,var(--color-black)_100%)] rounded-2xl overflow-hidden border border-[var(--color-neon)]/5 shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-4 border border-[var(--color-neon)]/15 pointer-events-none" />
        <div className="absolute left-4 right-4 top-4 h-1/4 border-b border-[var(--color-neon)]/15 pointer-events-none" />
        <div className="absolute left-4 right-4 bottom-4 h-1/4 border-t border-[var(--color-neon)]/15 pointer-events-none" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/3 h-[16.666%] border-l border-r border-b border-[var(--color-neon)]/15 pointer-events-none" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-[16.666%] border-l border-r border-t border-[var(--color-neon)]/15 pointer-events-none" />
        <div className="absolute top-1/2 left-4 right-4 h-px -translate-y-1/2 bg-[var(--color-neon)]/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] rounded-full border border-[var(--color-neon)]/15 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div
          className="absolute inset-0 grid pt-9 px-5 pb-20 gap-1.5"
          style={{ gridTemplateRows: `repeat(${formation.rows.length}, 1fr)` }}
        >
          {formation.rows.map((row, i) => (
            <PitchRow
              key={`${formation.id}-${i}`}
              positions={row}
              rowIndex={i}
              onSlotClick={onSlotClick}
              selectedPlayers={selectedPlayers}
            />
          ))}
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <PlayerSlotButton
            position="GK"
            isGK
            playerFaceUrl={gkPlayer?.player_face_url}
            playerName={gkPlayer?.short_name}
            onClick={() => onSlotClick("GK", "GK")}
          />
        </div>

        <div className="absolute top-4 right-4 text-right pointer-events-none">
          <div className="font-[Bebas_Neue,sans-serif] text-[40px] text-[var(--color-neon)]/5 leading-none">
            {formation.label}
          </div>
        </div>
      </div>
    </section>
  );
}
