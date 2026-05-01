"use client";

import { Pitch } from "@/components/ui/dream-team/Pitch";
import type { IFormation } from "@/features/main/football/types";
import type { SelectedPlayers } from "@/features/main/dashboard/types";

interface BattleTeamCardProps {
  username: string;
  totalScore: number;
  formation: IFormation;
  players: SelectedPlayers;
  /** "preview" = pre-battle card with scaled pitch; "result" = post-battle with winner highlight */
  variant: "preview" | "result";
  side: "me" | "opponent";
  isWinner?: boolean;
}

const SIDE_STYLES = {
  me: {
    label: "YOUR SQUAD",
    badge: "YOU",
    scoreColor: "text-[#00ff66]",
    winBg: "bg-[rgba(0,255,102,0.03)]",
    winBorder: "border-[#00ff66]/30",
    winShadow: "shadow-[0_0_50px_rgba(0,255,102,0.1)]",
    previewBorder: "border-[rgba(0,255,102,0.15)]",
  },
  opponent: {
    label: "RIVAL SQUAD",
    badge: "RIVAL",
    scoreColor: "text-[#ff4444]",
    winBg: "bg-[rgba(255,68,68,0.03)]",
    winBorder: "border-[#ff4444]/30",
    winShadow: "shadow-[0_0_50px_rgba(255,68,68,0.1)]",
    previewBorder: "border-[rgba(255,68,68,0.15)]",
  },
};

export function BattleTeamCard({
  username,
  totalScore,
  formation,
  players,
  variant,
  side,
  isWinner,
}: BattleTeamCardProps) {
  const s = SIDE_STYLES[side];

  if (variant === "preview") {
    return (
      <div
        className={`bg-[#0f0f0f] border ${s.previewBorder} p-6 rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,255,102,0.05)]`}
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#00ff66] uppercase mb-1 block">
              {s.label}
            </span>
            <h2 className="text-3xl font-[Bebas_Neue] uppercase">
              {username}&apos;s XI
            </h2>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-black ${s.scoreColor}`}>
              {totalScore}
            </div>
            <div className="text-[8px] font-bold text-[#aaaba7] tracking-widest uppercase">
              RATING
            </div>
          </div>
        </div>
        <div className="scale-[0.8] origin-top">
          <Pitch
            formation={formation}
            onSlotClick={() => {}}
            selectedPlayers={players}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-4 p-4 rounded-[40px] border transition-all duration-1000 ${
        isWinner
          ? `${s.winBg} ${s.winBorder} ${s.winShadow}`
          : "bg-transparent border-white/5 opacity-60"
      }`}
    >
      <div className="flex justify-between items-center px-4">
        <h3 className="font-[Bebas_Neue] text-2xl uppercase">
          {username}{" "}
          <span className="text-[10px] text-[#aaaba7]">({s.badge})</span>
        </h3>
        <div className={`text-4xl font-black ${s.scoreColor}`}>
          {totalScore}
        </div>
      </div>
      <Pitch
        formation={formation}
        onSlotClick={() => {}}
        selectedPlayers={players}
      />
    </div>
  );
}
