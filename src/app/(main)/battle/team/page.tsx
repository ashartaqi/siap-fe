"use client";

import { useState, useMemo } from "react";
import { Swords, Trophy, Skull, Users, ChevronLeft } from "lucide-react";
import {
  useGetBattleUsers,
  useGetUserDreamTeam,
  useClaimBattleReward,
} from "@/features/main/battle";
import { useGetDreamTeam } from "@/features/main/dashboard/hooks/useGetDreamTeam";
import { IDreamTeamResponse } from "@/features/main/dashboard/types";
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { useGetFormations } from "@/features/main/football";
import { Pitch } from "@/components/ui/dream-team/Pitch";
import type { SelectedPlayers } from "@/types/dreamTeam";

export default function TeamBattlePage() {
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState<{
    winner: "me" | "opponent" | "draw";
  } | null>(null);

  const { data: users = [] } = useGetBattleUsers();
  const { data: myTeam } = useGetDreamTeam();
  const { data: opponentTeam, isLoading: loadingOpponent } =
    useGetUserDreamTeam(opponentId);
  const { data: currentUser } = useGetUser();
  const { data: formations = [] } = useGetFormations();

  const battleUsers = users.filter((u) => u.has_team);

  const convertSlotsToPlayers = (slots: IDreamTeamResponse["slots"]) => {
    const players: SelectedPlayers = {};
    slots.forEach((slot) => {
      if (slot.player) {
        const slotId =
          slot.position === "GK"
            ? "GK"
            : `r${slot.row}-c${slot.col}-${slot.position}`;
        players[slotId] = slot.player;
      }
    });
    return players;
  };

  const myPlayers = useMemo(
    () => (myTeam ? convertSlotsToPlayers(myTeam.slots) : {}),
    [myTeam],
  );
  const opponentPlayers = useMemo(
    () => (opponentTeam ? convertSlotsToPlayers(opponentTeam.slots) : {}),
    [opponentTeam],
  );

  const myFormation =
    formations.find((f) => f.id === myTeam?.formation) || formations[0];
  const opponentFormation =
    formations.find((f) => f.id === opponentTeam?.formation) || formations[0];

  const { mutate: claimReward } = useClaimBattleReward();

  const startBattle = () => {
    if (!myTeam || !opponentTeam) return;

    setIsBattling(true);
    setShowResult(false);

    setTimeout(() => {
      const myScore = myTeam.total_score;
      const oppScore = opponentTeam.total_score;

      let result: "win" | "loss" | "draw" = "draw";
      if (myScore > oppScore) {
        setBattleResult({ winner: "me" });
        result = "win";
      } else if (oppScore > myScore) {
        setBattleResult({ winner: "opponent" });
        result = "loss";
      } else {
        setBattleResult({ winner: "draw" });
        result = "draw";
      }

      claimReward(result);
      setIsBattling(false);
      setShowResult(true);
    }, 3000); // 3 seconds of "analyzing"
  };

  const resetBattle = () => {
    setOpponentId(null);
    setBattleResult(null);
    setShowResult(false);
  };

  if (!myTeam) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Skull size={60} className="text-[#ff4444] mb-4 opacity-20" />
        <h2 className="text-2xl font-[Bebas_Neue] uppercase tracking-wider mb-2">
          No Dream Team Found
        </h2>
        <p className="text-[#aaaba7] text-sm">
          You need to create a Dream Team before you can battle!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 font-[Oxanium,sans-serif] px-4">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-5xl font-[Bebas_Neue] tracking-tighter uppercase mb-2">
          ULTIMATE <span className="text-[#00ff66]">TEAM BATTLE</span>
        </h1>
        <div className="h-1 w-24 bg-[#00ff66] rounded-full shadow-[0_0_10px_#00ff66]" />
      </div>

      {!showResult && !isBattling ? (
        <div className="flex flex-col items-center gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center max-w-5xl">
            {/* Me Preview */}
            <div className="flex flex-col gap-4 animate-in slide-in-from-left-8 duration-500">
              <div className="bg-[#0f0f0f] border border-[rgba(0,255,102,0.15)] p-6 rounded-3xl relative overflow-hidden group shadow-[0_0_20px_rgba(0,255,102,0.05)]">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-[#00ff66] uppercase mb-1 block">
                      YOUR SQUAD
                    </span>
                    <h2 className="text-3xl font-[Bebas_Neue] uppercase">
                      {currentUser?.username}&apos;S XI
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-[#00ff66]">
                      {myTeam.total_score}
                    </div>
                    <div className="text-[8px] font-bold text-[#aaaba7] tracking-widest uppercase">
                      RATING
                    </div>
                  </div>
                </div>
                <div className="scale-[0.8] origin-top">
                  {myFormation && (
                    <Pitch
                      formation={myFormation}
                      onSlotClick={() => {}}
                      selectedPlayers={myPlayers}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Selection */}
            <div className="bg-[#121212] border border-[rgba(255,255,255,0.05)] p-8 rounded-3xl flex flex-col gap-8 shadow-2xl animate-in slide-in-from-right-8 duration-500">
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#ff4444] uppercase mb-4 block">
                  CHOOSE OPPONENT
                </span>
                <div className="relative group">
                  <select
                    onChange={(e) => setOpponentId(Number(e.target.value))}
                    value={opponentId || ""}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-4 text-[13px] outline-none focus:border-[#00ff66] text-[#fcfcf8] appearance-none cursor-pointer hover:border-[#444] transition-all"
                  >
                    <option value="" disabled className="bg-[#121212]">
                      Select Rival User
                    </option>
                    {battleUsers.map((u) => (
                      <option
                        key={u.id}
                        value={u.id}
                        className="bg-[#121212] py-2"
                      >
                        {u.username}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#555] group-hover:text-[#888]">
                    <Users size={18} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-[11px] text-[#aaaba7] text-center italic">
                  &quot;Only those who have crafted their Dream Team can enter
                  the arena.&quot;
                </p>
                <button
                  onClick={startBattle}
                  disabled={!opponentId || loadingOpponent}
                  className="w-full bg-[#00ff66] text-[#0b0b0b] py-5 rounded-xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(0,255,102,0.15)] group"
                >
                  <Swords
                    size={22}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  INITIATE BATTLE
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {isBattling ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full items-center">
                <div className="flex flex-col items-center animate-pulse">
                  <h3 className="text-[#00ff66] font-bold text-sm tracking-widest uppercase mb-4">
                    DEPLOYING YOUR SQUAD
                  </h3>
                  <div className="w-full opacity-40 scale-75 grayscale blur-[2px]">
                    {myFormation && (
                      <Pitch
                        formation={myFormation}
                        onSlotClick={() => {}}
                        selectedPlayers={myPlayers}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center animate-pulse animate-delay-300">
                  <h3 className="text-[#ff4444] font-bold text-sm tracking-widest uppercase mb-4">
                    SCOUTING RIVAL
                  </h3>
                  <div className="w-full opacity-40 scale-75 grayscale blur-[2px]">
                    <div className="w-full aspect-[3/4] bg-[#121212] rounded-2xl border border-dashed border-[#333] flex items-center justify-center">
                      <Swords
                        size={60}
                        className="text-[#333] animate-spin-slow"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <div className="text-3xl font-[Bebas_Neue] text-[#00ff66] animate-bounce">
                  ANALYZING TACTICS...
                </div>
                <div className="text-[10px] text-[#555] uppercase tracking-[0.5em] mt-2">
                  SIMULATING MATCH SCENARIO
                </div>
              </div>
            </div>
          ) : (
            showResult &&
            opponentTeam && (
              <div className="w-full animate-in fade-in zoom-in duration-1000">
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={resetBattle}
                    className="flex items-center gap-2 text-[10px] font-bold text-[#aaaba7] hover:text-[#00ff66] transition-colors"
                  >
                    <ChevronLeft size={16} /> BACK
                  </button>
                  <div
                    className={`text-5xl font-[Bebas_Neue] uppercase tracking-tighter ${battleResult?.winner === "me" ? "text-[#00ff66]" : battleResult?.winner === "opponent" ? "text-[#ff4444]" : "text-[#aaaba7]"}`}
                  >
                    {battleResult?.winner === "me"
                      ? "VICTORY"
                      : battleResult?.winner === "opponent"
                        ? "DEFEAT"
                        : "STALEMATE"}
                  </div>
                  <div className="w-10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
                  {/* My Pitch */}
                  <div
                    className={`flex flex-col gap-4 p-4 rounded-[40px] border transition-all duration-1000 ${battleResult?.winner === "me" ? "bg-[rgba(0,255,102,0.03)] border-[#00ff66]/30 shadow-[0_0_50px_rgba(0,255,102,0.1)]" : "bg-transparent border-white/5 opacity-60"}`}
                  >
                    <div className="flex justify-between items-center px-4">
                      <h3 className="font-[Bebas_Neue] text-2xl uppercase">
                        {currentUser?.username}{" "}
                        <span className="text-[10px] text-[#aaaba7]">
                          (YOU)
                        </span>
                      </h3>
                      <div className="text-4xl font-black text-[#00ff66]">
                        {myTeam.total_score}
                      </div>
                    </div>
                    {myFormation && (
                      <Pitch
                        formation={myFormation}
                        onSlotClick={() => {}}
                        selectedPlayers={myPlayers}
                      />
                    )}
                  </div>

                  {/* Opponent Pitch */}
                  <div
                    className={`flex flex-col gap-4 p-4 rounded-[40px] border transition-all duration-1000 ${battleResult?.winner === "opponent" ? "bg-[rgba(255,68,68,0.03)] border-[#ff4444]/30 shadow-[0_0_50px_rgba(255,68,68,0.1)]" : "bg-transparent border-white/5 opacity-60"}`}
                  >
                    <div className="flex justify-between items-center px-4">
                      <h3 className="font-[Bebas_Neue] text-2xl uppercase">
                        {battleUsers.find((u) => u.id === opponentId)?.username}{" "}
                        <span className="text-[10px] text-[#aaaba7]">
                          (RIVAL)
                        </span>
                      </h3>
                      <div className="text-4xl font-black text-[#ff4444]">
                        {opponentTeam.total_score}
                      </div>
                    </div>
                    {opponentFormation && (
                      <Pitch
                        formation={opponentFormation}
                        onSlotClick={() => {}}
                        selectedPlayers={opponentPlayers}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  {battleResult?.winner === "me" ? (
                    <div className="flex flex-col items-center gap-2 animate-bounce">
                      <Trophy size={60} className="text-[#00ff66]" />
                      <p className="text-[#00ff66] font-bold tracking-widest uppercase text-sm">
                        YOU DOMINATED THE PITCH
                      </p>
                    </div>
                  ) : battleResult?.winner === "opponent" ? (
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

                  <button
                    onClick={resetBattle}
                    className="px-12 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                  >
                    RETRY BATTLE
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}
