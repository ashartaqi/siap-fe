"use client";

import { User as UserIcon, Zap, Swords } from "lucide-react";
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
  const showPreview = opponentId && (opponentPlayer || loadingOpponent);

  return (
    <div className="flex flex-col items-center gap-10 max-w-6xl mx-auto">
      {/* Opponent selector */}
      <div className="w-full max-w-md animate-in slide-in-from-top-4 duration-500">
        <div className="bg-[#121212] border border-[rgba(255,255,255,0.05)] px-8 py-6 rounded-3xl shadow-2xl">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#ff4444] uppercase mb-4 block text-center">
            CHOOSE YOUR RIVAL
          </span>
          <div className="relative group">
            <select
              onChange={(e) => onSelectOpponent(Number(e.target.value))}
              value={opponentId ?? ""}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-2xl px-6 py-4 text-[14px] outline-none focus:border-[#00ff66] text-[#fcfcf8] appearance-none cursor-pointer hover:border-[#444] transition-all"
            >
              <option value="" disabled className="bg-[#121212]">
                Select a User
              </option>
              {battleUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#121212] py-2">
                  {u.username}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#555] group-hover:text-[#888]">
              <Zap size={20} />
            </div>
            {errorOpponent && (
              <p className="mt-2 text-[10px] text-[#ff4444] font-bold uppercase tracking-widest text-center">
                Failed to fetch opponent data
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Player cards */}
      <div
        className={`grid gap-8 w-full items-center ${
          showPreview
            ? "grid-cols-1 md:grid-cols-[1fr_auto_1fr]"
            : "grid-cols-1 md:grid-cols-2 max-w-3xl"
        }`}
      >
        <PlayerCard player={myPlayer} side="me" />

        {showPreview && (
          <div className="flex flex-col items-center justify-center px-4">
            <div className="text-7xl font-black italic opacity-10 tracking-tighter select-none">
              VS
            </div>
          </div>
        )}

        {showPreview &&
          (loadingOpponent ? (
            <div className="bg-[#0f0f0f] border border-[rgba(255,68,68,0.08)] rounded-[40px] p-10 flex items-center justify-center min-h-[320px] animate-in fade-in duration-300">
              <div className="w-10 h-10 border-2 border-[#ff4444] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : opponentPlayer ? (
            <PlayerCard player={opponentPlayer} side="opponent" />
          ) : null)}

        {!showPreview && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
            <p className="text-[11px] text-[#aaaba7] text-center italic opacity-60">
              &quot;Every attribute counts. May the superior player
              prevail.&quot;
            </p>
          </div>
        )}
      </div>

      {/* Battle button */}
      <button
        onClick={onStartBattle}
        disabled={!opponentId || loadingOpponent || !opponentPlayer}
        className="px-16 py-5 bg-[#00ff66] text-[#0b0b0b] rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale disabled:hover:scale-100 flex items-center gap-4 shadow-[0_10px_40px_rgba(0,255,102,0.15)] group animate-in slide-in-from-bottom-4 duration-500"
      >
        <Swords
          size={22}
          className="group-hover:rotate-12 transition-transform"
        />
        INITIATE DUEL
      </button>
    </div>
  );
}
