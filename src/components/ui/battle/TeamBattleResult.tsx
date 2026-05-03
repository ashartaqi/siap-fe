"use client";

import { Trophy, Skull, ChevronLeft } from "lucide-react";
import { BattleTeamCard } from "./BattleTeamCard";
import { BattleMatchReport } from "./BattleMatchReport";
import type { IMatchSimulationResult } from "@/features/main/battle/apis/battle";
import type {
  IDreamTeamResponse,
  SelectedPlayers,
} from "@/features/main/dashboard/types";
import type { IFormation } from "@/features/main/football/types";

interface TeamBattleResultProps {
  battleResult: IMatchSimulationResult;
  myTeam: IDreamTeamResponse;
  opponentTeam: IDreamTeamResponse;
  myFormation: IFormation;
  opponentFormation: IFormation;
  myPlayers: SelectedPlayers;
  opponentPlayers: SelectedPlayers;
  myUsername: string;
  opponentUsername: string;
  simDone: boolean;
  onSimulationComplete: () => void;
  onReset: () => void;
}

export function TeamBattleResult({
  battleResult,
  myTeam,
  opponentTeam,
  myFormation,
  opponentFormation,
  myPlayers,
  opponentPlayers,
  myUsername,
  opponentUsername,
  simDone,
  onSimulationComplete,
  onReset,
}: TeamBattleResultProps) {
  const { winner, score1, score2, stats, log, reward } = battleResult;

  return (
    <div className="w-full animate-in fade-in zoom-in duration-700">
      {/* Header: back + score */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-[10px] font-bold text-[#aaaba7] hover:text-[#00ff66] transition-colors"
        >
          <ChevronLeft size={16} /> BACK
        </button>

        {simDone ? (
          <div
            className={`text-5xl font-[Bebas_Neue] uppercase tracking-tighter animate-in fade-in zoom-in duration-500 ${
              winner === "me"
                ? "text-[#00ff66]"
                : winner === "opponent"
                  ? "text-[#ff4444]"
                  : "text-[#aaaba7]"
            }`}
          >
            {score1} – {score2}
          </div>
        ) : (
          <div className="text-5xl font-[Bebas_Neue] uppercase tracking-tighter text-[#333] select-none">
            ? – ?
          </div>
        )}
        <div className="w-10" />
      </div>

      {/* Simulation log */}
      <div className="flex justify-center mb-10">
        <BattleMatchReport
          stats={stats}
          log={log}
          onSimulationComplete={onSimulationComplete}
        />
      </div>

      {/* Team cards + outcome — revealed after sim finishes */}
      {simDone && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BattleTeamCard
              variant="result"
              side="me"
              username={myUsername}
              totalScore={myTeam.total_score}
              formation={myFormation}
              players={myPlayers}
              isWinner={winner === "me"}
            />
            <BattleTeamCard
              variant="result"
              side="opponent"
              username={opponentUsername}
              totalScore={opponentTeam.total_score}
              formation={opponentFormation}
              players={opponentPlayers}
              isWinner={winner === "opponent"}
            />
          </div>

          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
            {winner === "me" ? (
              <div className="flex flex-col items-center gap-2 animate-bounce">
                <Trophy size={60} className="text-[#00ff66]" />
                <p className="text-[#00ff66] font-bold tracking-widest uppercase text-sm">
                  YOU DOMINATED THE PITCH
                </p>
              </div>
            ) : winner === "opponent" ? (
              <div className="flex flex-col items-center gap-2">
                <Skull size={60} className="text-[#ff4444] opacity-50" />
                <p className="text-[#ff4444] font-bold tracking-widest uppercase text-sm">
                  YOUR TACTICS WERE OUTMATCHED
                </p>
              </div>
            ) : (
              <p className="text-[#aaaba7] font-bold tracking-widest uppercase text-sm">
                IT WAS A TACTICAL DEADLOCK
              </p>
            )}

            <p className="text-[#aaaba7] font-bold tracking-widest uppercase text-sm">
              REWARD: +{reward} BB
            </p>

            <button
              onClick={onReset}
              className="px-12 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
            >
              RETRY BATTLE
            </button>
          </div>
        </>
      )}
    </div>
  );
}
