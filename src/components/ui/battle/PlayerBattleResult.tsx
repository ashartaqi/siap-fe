"use client";

import { Trophy, ChevronLeft } from "lucide-react";
import type { IDreamPlayerResponse } from "@/features/main/dashboard/types";

const DISPLAY_STATS = [
  "PACE",
  "SHOOTING",
  "PASSING",
  "DRIBBLING",
  "DEFENDING",
  "PHYSIC",
] as const;

interface PlayerBattleResultProps {
  myPlayer: IDreamPlayerResponse;
  opponentPlayer: IDreamPlayerResponse;
  winner: "me" | "opponent" | "draw";
  onReset: () => void;
}

function StatRow({
  stat,
  myValue,
  oppValue,
}: {
  stat: string;
  myValue: number;
  oppValue: number;
}) {
  const isWin = myValue > oppValue;
  const isLoss = oppValue > myValue;
  const total = myValue + oppValue || 1;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span
          className={`text-[18px] font-black ${isWin ? "text-[#00ff66]" : "text-white/20"}`}
        >
          {myValue}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#aaaba7] mb-1">
          {stat}
        </span>
        <span
          className={`text-[18px] font-black ${isLoss ? "text-[#ff4444]" : "text-white/20"}`}
        >
          {oppValue}
        </span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full flex overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${isWin ? "bg-[#00ff66] shadow-[0_0_10px_#00ff66]" : "bg-white/10"}`}
          style={{ width: `${(myValue / total) * 100}%` }}
        />
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${isLoss ? "bg-[#ff4444] shadow-[0_0_10px_#ff4444]" : "bg-white/10"}`}
          style={{ width: `${(oppValue / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function PlayerBattleResult({
  myPlayer,
  opponentPlayer,
  winner,
  onReset,
}: PlayerBattleResultProps) {
  const outcomeColor =
    winner === "me"
      ? "text-[#00ff66]"
      : winner === "opponent"
        ? "text-[#ff4444]"
        : "text-[#ffcc00]";
  const outcomeLabel =
    winner === "me" ? "VICTORY" : winner === "opponent" ? "DEFEAT" : "DRAW";

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-1000">
      {/* Outcome header */}
      <div className="flex items-center gap-8 mb-12 w-full max-w-4xl justify-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#333]" />
        <div
          className={`text-6xl font-[Bebas_Neue] uppercase tracking-tighter ${outcomeColor}`}
        >
          {outcomeLabel}
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#333]" />
      </div>

      {/* Player cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full items-center mb-16 px-4">
        <div
          className={`relative p-10 rounded-[40px] border transition-all duration-1000 ${
            winner === "me"
              ? "bg-[rgba(0,255,102,0.03)] border-[#00ff66]/40 scale-105 shadow-[0_0_60px_rgba(0,255,102,0.15)]"
              : "bg-[#0f0f0f] border-white/5 opacity-50"
          }`}
        >
          {winner === "me" && (
            <div className="absolute -top-6 -right-6 bg-[#00ff66] text-[#0b0b0b] p-3 rounded-full shadow-lg">
              <Trophy size={32} />
            </div>
          )}
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#aaaba7] mb-4 block">
            YOU
          </span>
          <h2 className="text-4xl font-[Bebas_Neue] uppercase mb-1">
            {myPlayer.name}
          </h2>
          <div className="text-6xl font-black text-[#00ff66]">
            {myPlayer.overall}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-9xl font-black italic opacity-5 mb-4 tracking-tighter select-none">
            VS
          </div>
        </div>

        <div
          className={`relative p-10 rounded-[40px] border transition-all duration-1000 ${
            winner === "opponent"
              ? "bg-[rgba(255,68,68,0.03)] border-[#ff4444]/40 scale-105 shadow-[0_0_60px_rgba(255,68,68,0.15)]"
              : "bg-[#0f0f0f] border-white/5 opacity-50"
          }`}
        >
          {winner === "opponent" && (
            <div className="absolute -top-6 -right-6 bg-[#ff4444] text-white p-3 rounded-full shadow-lg">
              <Trophy size={32} />
            </div>
          )}
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#aaaba7] mb-4 block">
            OPPONENT
          </span>
          <h2 className="text-4xl font-[Bebas_Neue] uppercase mb-1">
            {opponentPlayer.name}
          </h2>
          <div className="text-6xl font-black text-[#ff4444]">
            {opponentPlayer.overall}
          </div>
        </div>
      </div>

      {/* Stat comparison */}
      <div className="w-full max-w-2xl bg-[rgba(18,18,18,0.6)] backdrop-blur-xl border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl">
        {DISPLAY_STATS.map((stat) => {
          const myValue =
            myPlayer[stat.toLowerCase() as keyof IDreamPlayerResponse];
          const oppValue =
            opponentPlayer[stat.toLowerCase() as keyof IDreamPlayerResponse];
          if (typeof myValue !== "number" || typeof oppValue !== "number")
            return null;
          return (
            <StatRow
              key={stat}
              stat={stat}
              myValue={myValue}
              oppValue={oppValue}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-16 mb-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-[10px] font-bold text-[#aaaba7] hover:text-[#00ff66] transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> NEW BATTLE
        </button>
      </div>
    </div>
  );
}
