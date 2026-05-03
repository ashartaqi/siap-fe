"use client";

import { User as UserIcon, Swords, Users } from "lucide-react";
import type { IDreamPlayerResponse } from "@/features/main/dashboard/types";
import type { BattleUser } from "@/features/main/battle/apis/battle";

const DISPLAY_STATS = [
  "PACE",
  "SHOOTING",
  "PASSING",
  "DRIBBLING",
  "DEFENDING",
  "PHYSIC",
] as const;

interface PlayerBattleSetupProps {
  myPlayer: IDreamPlayerResponse;
  opponentPlayer?: IDreamPlayerResponse;
  battleUsers: BattleUser[];
  opponentId: number | null;
  loadingOpponent: boolean;
  errorOpponent: boolean;
  onSelectOpponent: (id: number) => void;
  onStartBattle: () => void;
}

function PlayerCard({
  player,
  side,
}: {
  player: IDreamPlayerResponse;
  side: "me" | "opponent";
}) {
  const isMe = side === "me";
  return (
    <div
      className={`bg-[#0f0f0f] border p-10 rounded-[40px] relative overflow-hidden group shadow-[0_0_30px_rgba(0,255,102,0.05)] animate-in duration-500 ${
        isMe
          ? "border-[rgba(0,255,102,0.15)] slide-in-from-left-8"
          : "border-[rgba(255,68,68,0.15)] slide-in-from-right-8"
      }`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <UserIcon size={120} />
      </div>
      <span
        className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block ${
          isMe ? "text-[#00ff66]" : "text-[#ff4444]"
        }`}
      >
        {isMe ? "YOUR CHAMPION" : "RIVAL"}
      </span>
      <h2 className="text-4xl font-[Bebas_Neue] uppercase mb-1">
        {player.name}
      </h2>
      <div
        className={`text-6xl font-black mb-8 ${isMe ? "text-[#00ff66]" : "text-[#ff4444]"}`}
      >
        {player.overall}
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {DISPLAY_STATS.map((stat) => (
          <div
            key={stat}
            className="flex items-center justify-between border-b border-white/5 pb-1"
          >
            <span className="text-[9px] font-bold uppercase text-[#aaaba7]">
              {stat}
            </span>
            <span className="text-[13px] font-bold">
              {
                player[
                  stat.toLowerCase() as keyof IDreamPlayerResponse
                ] as number
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlayerBattleSetup({
  myPlayer,
  opponentPlayer,
  battleUsers,
  opponentId,
  loadingOpponent,
  errorOpponent,
  onSelectOpponent,
  onStartBattle,
}: PlayerBattleSetupProps) {
  const handleMatchmaking = () => {
    if (battleUsers.length === 0) return;
    const randomIndex = Math.floor(Math.random() * battleUsers.length);
    onSelectOpponent(battleUsers[randomIndex].id);
  };

  const showPreview = opponentId && (opponentPlayer || loadingOpponent);

  return (
    <div className="flex flex-col items-center gap-12 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
        {/* My player card */}
        <div className="animate-in slide-in-from-left-8 duration-500">
          <PlayerCard player={myPlayer} side="me" />
        </div>

        {/* Matchmaking panel */}
        <div className="bg-[#121212] border border-[rgba(255,255,255,0.05)] p-8 rounded-3xl flex flex-col gap-8 shadow-2xl animate-in slide-in-from-right-8 duration-500">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#ff4444] uppercase mb-4 block">
              ARENA MATCHMAKING
            </span>

            {/* Random opponent button */}
            <button
              onClick={handleMatchmaking}
              disabled={battleUsers.length === 0}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-8 text-[13px] text-[#fcfcf8] hover:border-[#00ff66] hover:bg-[#1f1f1f] transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,102,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />

              {loadingOpponent ? (
                <div className="w-6 h-6 border-2 border-[#00ff66] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Users
                  size={24}
                  className="text-[#555] group-hover:text-[#00ff66] transition-all group-hover:scale-110"
                />
              )}

              <span className="font-bold tracking-widest uppercase">
                {opponentId
                  ? battleUsers.find((u) => u.id === opponentId)?.username
                  : "Find Random Opponent"}
              </span>

              {opponentId && !loadingOpponent && (
                <span className="text-[9px] text-[#00ff66] animate-pulse">
                  RIVAL ACQUIRED
                </span>
              )}
            </button>

            {errorOpponent && (
              <p className="mt-3 text-[10px] text-[#ff4444] font-bold uppercase tracking-widest text-center">
                Failed to fetch opponent data
              </p>
            )}
          </div>

          {/* Opponent preview (inline, compact) */}
          {showPreview && (
            <div className="animate-in fade-in duration-300">
              {loadingOpponent ? (
                <div className="border border-[rgba(255,68,68,0.08)] rounded-2xl p-6 flex items-center justify-center min-h-[80px]">
                  <div className="w-8 h-8 border-2 border-[#ff4444] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : opponentPlayer ? (
                <div className="border border-[rgba(255,68,68,0.15)] rounded-2xl p-5 bg-[#0f0f0f]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-bold tracking-[0.3em] text-[#ff4444] uppercase">
                      RIVAL STATS
                    </span>
                    <span className="text-2xl font-black text-[#ff4444]">
                      {opponentPlayer.overall}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                    {DISPLAY_STATS.map((stat) => (
                      <div key={stat} className="flex flex-col">
                        <span className="text-[8px] font-bold uppercase text-[#555]">
                          {stat}
                        </span>
                        <span className="text-[12px] font-bold">
                          {
                            opponentPlayer[
                              stat.toLowerCase() as keyof IDreamPlayerResponse
                            ] as number
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <p className="text-[11px] text-[#aaaba7] text-center italic">
              &quot;Every attribute counts. May the superior player
              prevail.&quot;
            </p>
            <button
              onClick={onStartBattle}
              disabled={!opponentId || loadingOpponent || !opponentPlayer}
              className="w-full bg-[#00ff66] text-[#0b0b0b] py-5 rounded-xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(0,255,102,0.15)] group"
            >
              <Swords
                size={22}
                className="group-hover:rotate-12 transition-transform"
              />
              INITIATE DUEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
