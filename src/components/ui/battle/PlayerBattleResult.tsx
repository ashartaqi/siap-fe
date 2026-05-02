"use client";

import { useState } from "react";
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
  const [simDone, setSimDone] = useState(false);

  const outcomeColor =
    winner === "me"
      ? "text-[#00ff66]"
      : winner === "opponent"
        ? "text-[#ff4444]"
        : "text-[#aaaba7]";

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      {/* Back button always visible */}
      <div className="flex items-center justify-between mb-8 w-full">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-[10px] font-bold text-[#aaaba7] hover:text-[#00ff66] transition-colors"
        >
          <ChevronLeft size={16} /> BACK
        </button>

        {/* Score — only revealed after simulation ends */}
        {simDone ? (
          <div
            className={`text-5xl font-[Bebas_Neue] uppercase tracking-tighter animate-in fade-in zoom-in duration-500 ${outcomeColor}`}
          >
            {battleResult?.score1 ?? 0} – {battleResult?.score2 ?? 0}
          </div>
        ) : (
          <div className="text-5xl font-[Bebas_Neue] uppercase tracking-tighter text-[#333] select-none">
            ? – ?
          </div>
        )}
        <div className="w-10" />
      </div>

      {/* Simulation playback — always first */}
      {battleResult && (
        <div className="w-full flex flex-col items-center gap-6 mb-10">
          <BattleMatchReport
            stats={battleResult.stats}
            log={battleResult.log}
            onSimulationComplete={() => setSimDone(true)}
          />
        </div>
      )}

      {/* Player cards — revealed after simulation */}
      {simDone && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div
            className={`relative p-10 rounded-[40px] border transition-all duration-1000 ${
              winner === "me"
                ? "bg-[rgba(0,255,102,0.03)] border-[#00ff66]/40 scale-105 shadow-[0_0_60px_rgba(0,255,102,0.15)]"
                : "bg-[#0f0f0f] border-white/5 opacity-50"
            }`}
          >
            {winner === "me" && (
              <div className="absolute -top-6 -right-6 bg-[#00ff66] text-[#0b0b0b] p-3 rounded-full shadow-lg animate-bounce">
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
              <div className="absolute -top-6 -right-6 bg-[#ff4444] text-white p-3 rounded-full shadow-lg animate-bounce">
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
      )}

      {/* Outcome message + reward + retry — only after simulation ends */}
      {simDone && (
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl animate-in fade-in duration-700">
          {winner === "me" ? (
            <p className="text-[#00ff66] font-bold tracking-widest uppercase text-sm">
              YOU DOMINATED THE PITCH
            </p>
          ) : winner === "opponent" ? (
            <p className="text-[#ff4444] font-bold tracking-widest uppercase text-sm">
              YOUR TACTICS WERE OUTMATCHED
            </p>
          ) : (
            <p className="text-[#aaaba7] font-bold tracking-widest uppercase text-sm">
              IT WAS A TACTICAL DEADLOCK
            </p>
          )}

          {battleResult && (
            <p className="text-[#aaaba7] font-bold tracking-widest uppercase text-sm">
              REWARD: +{battleResult.reward} BB
            </p>
          )}

          <button
            onClick={onReset}
            className="px-12 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
          >
            RETRY BATTLE
          </button>
        </div>
      )}
    </div>
  );
}
