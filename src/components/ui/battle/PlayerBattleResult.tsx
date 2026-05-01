"use client";

import { Trophy, ChevronLeft } from "lucide-react";
import type { IDreamPlayerResponse } from "@/features/main/dashboard/types";

import { BattleMatchReport } from "./BattleMatchReport";
import type { IMatchSimulationResult } from "@/features/main/battle/apis/battle";

interface PlayerBattleResultProps {
  myPlayer: IDreamPlayerResponse;
  opponentPlayer: IDreamPlayerResponse;
  winner: "me" | "opponent" | "draw";
  battleResult?: IMatchSimulationResult;
  onReset: () => void;
}

export function PlayerBattleResult({
  myPlayer,
  opponentPlayer,
  winner,
  battleResult,
  onReset,
}: PlayerBattleResultProps) {
  const outcomeColor =
    winner === "me"
      ? "text-[#00ff66]"
      : winner === "opponent"
        ? "text-[#ff4444]"
        : "text-[#aaaba7]";

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      <div className="flex items-center justify-between mb-8 w-full">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-[10px] font-bold text-[#aaaba7] hover:text-[#00ff66] transition-colors"
        >
          <ChevronLeft size={16} /> BACK
        </button>
        <div
          className={`text-5xl font-[Bebas_Neue] uppercase tracking-tighter ${outcomeColor}`}
        >
          {battleResult?.score1 ?? 0} – {battleResult?.score2 ?? 0}
        </div>
        <div className="w-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center mb-12">
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

      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        {winner === "me" ? (
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <Trophy size={60} className="text-[#00ff66]" />
            <p className="text-[#00ff66] font-bold tracking-widest uppercase text-sm">
              YOU DOMINATED THE PITCH
            </p>
          </div>
        ) : winner === "opponent" ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[#ff4444] font-bold tracking-widest uppercase text-sm">
              YOUR TACTICS WERE OUTMATCHED
            </p>
          </div>
        ) : (
          <p className="text-[#aaaba7] font-bold tracking-widest uppercase text-sm">
            IT WAS A TACTICAL DEADLOCK
          </p>
        )}

        {battleResult && (
          <div className="w-full flex flex-col items-center gap-6 mb-8">
            <BattleMatchReport
              stats={battleResult.stats}
              log={battleResult.log}
            />
            <p className="text-[#aaaba7] font-bold tracking-widest uppercase text-sm mt-4">
              REWARD: +{battleResult.reward} BB
            </p>
          </div>
        )}

        <button
          onClick={onReset}
          className="px-12 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
        >
          RETRY BATTLE
        </button>
      </div>
    </div>
  );
}
