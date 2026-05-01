"use client";

import { useState } from "react";
import {
  Swords,
  User as UserIcon,
  Trophy,
  Skull,
  ChevronLeft,
  Zap,
} from "lucide-react";
import {
  useGetBattleUsers,
  useGetUserCustomPlayer,
  useClaimBattleReward,
} from "@/features/main/battle";
import { useGetDreamPlayer } from "@/features/main/dashboard/hooks/useGetDreamPlayer";
import { IDreamPlayerResponse } from "@/features/main/dashboard/types";

export default function PlayerBattlePage() {
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState<{
    winner: "me" | "opponent" | "draw";
    myScore: number;
    opponentScore: number;
  } | null>(null);

  const { data: users = [] } = useGetBattleUsers();
  const { data: myPlayer } = useGetDreamPlayer();
  const {
    data: opponentPlayer,
    isLoading: loadingOpponent,
    isError: errorOpponent,
  } = useGetUserCustomPlayer(opponentId);

  const { mutate: claimReward } = useClaimBattleReward();
  const battleUsers = users.filter((u) => u.has_player);

  const startBattle = () => {
    if (!myPlayer || !opponentPlayer) return;

    setIsBattling(true);
    setShowResult(false);

    // Simple logic: Compare stats
    const stats = [
      "pace",
      "shooting",
      "passing",
      "dribbling",
      "defending",
      "physic",
      "overall",
    ] as const;
    let myScore = 0;
    let oppScore = 0;

    stats.forEach((stat) => {
      const myStat = myPlayer[stat as keyof IDreamPlayerResponse];
      const oppStat = opponentPlayer[stat as keyof IDreamPlayerResponse];

      if (typeof myStat === "number" && typeof oppStat === "number") {
        if (myStat > oppStat) myScore++;
        else if (myStat < oppStat) oppScore++;
      }
    });

    setTimeout(() => {
      let result: "win" | "loss" | "draw" = "draw";
      if (myScore > oppScore) {
        setBattleResult({ winner: "me", myScore, opponentScore: oppScore });
        result = "win";
      } else if (oppScore > myScore) {
        setBattleResult({
          winner: "opponent",
          myScore,
          opponentScore: oppScore,
        });
        result = "loss";
      } else {
        setBattleResult({ winner: "draw", myScore, opponentScore: oppScore });
        result = "draw";
      }

      claimReward(result);
      setIsBattling(false);
      setShowResult(true);
    }, 2500);
  };

  const resetBattle = () => {
    setOpponentId(null);
    setBattleResult(null);
    setShowResult(false);
  };

  if (!myPlayer) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Skull size={60} className="text-[#ff4444] mb-4 opacity-20" />
        <h2 className="text-2xl font-[Bebas_Neue] uppercase tracking-wider mb-2">
          No Dream Player Found
        </h2>
        <p className="text-[#aaaba7] text-sm">
          You need to create a Dream Player before you can battle!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 font-[Oxanium,sans-serif] px-4">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-5xl font-[Bebas_Neue] tracking-tighter uppercase mb-2">
          ULTIMATE <span className="text-[#00ff66]">PLAYER BATTLE</span>
        </h1>
        <div className="h-1 w-24 bg-[#00ff66] rounded-full shadow-[0_0_10px_#00ff66]" />
      </div>

      {!showResult && !isBattling ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Me Card */}
          <div className="bg-[#0f0f0f] border border-[rgba(0,255,102,0.15)] p-10 rounded-[40px] relative overflow-hidden group shadow-[0_0_30px_rgba(0,255,102,0.05)] animate-in slide-in-from-left-8 duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <UserIcon size={120} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#00ff66] uppercase mb-4 block">
              YOUR CHAMPION
            </span>
            <h2 className="text-4xl font-[Bebas_Neue] uppercase mb-1">
              {myPlayer.name}
            </h2>
            <div className="text-6xl font-black text-[#00ff66] mb-8">
              {myPlayer.overall}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                "PACE",
                "SHOOTING",
                "PASSING",
                "DRIBBLING",
                "DEFENDING",
                "PHYSIC",
              ].map((stat) => (
                <div
                  key={stat}
                  className="flex items-center justify-between border-b border-white/5 pb-1"
                >
                  <span className="text-[9px] font-bold uppercase text-[#aaaba7]">
                    {stat}
                  </span>
                  <span className="text-[13px] font-bold">
                    {myPlayer[stat.toLowerCase() as keyof IDreamPlayerResponse]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Opponent Selection */}
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
            <div className="bg-[#121212] border border-[rgba(255,255,255,0.05)] p-10 rounded-[40px] shadow-2xl">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#ff4444] uppercase mb-6 block text-center">
                CHOOSE YOUR RIVAL
              </span>

              <div className="relative group mb-8">
                <select
                  onChange={(e) => setOpponentId(Number(e.target.value))}
                  value={opponentId || ""}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-2xl px-6 py-5 text-[14px] outline-none focus:border-[#00ff66] text-[#fcfcf8] appearance-none cursor-pointer hover:border-[#444] transition-all"
                >
                  <option value="" disabled className="bg-[#121212]">
                    Select a User
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
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#555] group-hover:text-[#888]">
                  <Zap size={20} />
                </div>
                {errorOpponent && (
                  <p className="absolute -bottom-6 left-0 text-[10px] text-[#ff4444] font-bold uppercase tracking-widest">
                    Failed to fetch opponent data
                  </p>
                )}
              </div>

              <button
                onClick={startBattle}
                disabled={!opponentId || loadingOpponent}
                className="w-full bg-[#00ff66] text-[#0b0b0b] py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(0,255,102,0.15)] group"
              >
                <Swords
                  size={22}
                  className="group-hover:rotate-12 transition-transform"
                />
                INITIATE DUEL
              </button>
            </div>

            <p className="text-[11px] text-[#aaaba7] text-center italic opacity-60">
              &quot;Every attribute counts. May the superior player
              prevail.&quot;
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] relative">
          {isBattling ? (
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center mb-12">
                <div className="absolute inset-0 border-4 border-[rgba(0,255,102,0.1)] border-t-[#00ff66] rounded-full animate-spin" />
                <Swords size={60} className="text-[#00ff66] animate-pulse" />
              </div>
              <h2 className="text-3xl font-[Bebas_Neue] uppercase tracking-[0.4em] text-[#00ff66] animate-bounce">
                POWERING UP...
              </h2>
              <div className="text-[10px] text-[#555] uppercase tracking-[0.6em] mt-4">
                COMPARING SKILL ATTRIBUTES
              </div>
            </div>
          ) : (
            showResult &&
            battleResult &&
            opponentPlayer && (
              <div className="w-full flex flex-col items-center animate-in fade-in duration-1000">
                <div className="flex items-center gap-8 mb-12 w-full max-w-4xl justify-center">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#333]" />
                  <div
                    className={`text-6xl font-[Bebas_Neue] uppercase tracking-tighter ${battleResult.winner === "me" ? "text-[#00ff66]" : battleResult.winner === "opponent" ? "text-[#ff4444]" : "text-[#ffcc00]"}`}
                  >
                    {battleResult.winner === "me"
                      ? "VICTORY"
                      : battleResult.winner === "opponent"
                        ? "DEFEAT"
                        : "DRAW"}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#333]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full items-center mb-16 px-4">
                  {/* My Card */}
                  <div
                    className={`p-10 rounded-[40px] border transition-all duration-1000 ${battleResult.winner === "me" ? "bg-[rgba(0,255,102,0.03)] border-[#00ff66]/40 scale-105 shadow-[0_0_60px_rgba(0,255,102,0.15)]" : "bg-[#0f0f0f] border-white/5 opacity-50"}`}
                  >
                    {battleResult.winner === "me" && (
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

                  {/* Opponent Card */}
                  <div
                    className={`p-10 rounded-[40px] border transition-all duration-1000 ${battleResult.winner === "opponent" ? "bg-[rgba(255,68,68,0.03)] border-[#ff4444]/40 scale-105 shadow-[0_0_60px_rgba(255,68,68,0.15)]" : "bg-[#0f0f0f] border-white/5 opacity-50"}`}
                  >
                    {battleResult.winner === "opponent" && (
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

                <div className="w-full max-w-2xl bg-[rgba(18,18,18,0.6)] backdrop-blur-xl border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl">
                  {[
                    "PACE",
                    "SHOOTING",
                    "PASSING",
                    "DRIBBLING",
                    "DEFENDING",
                    "PHYSIC",
                  ].map((stat) => {
                    const myStat =
                      myPlayer[
                        stat.toLowerCase() as keyof IDreamPlayerResponse
                      ];
                    const oppStat =
                      opponentPlayer[
                        stat.toLowerCase() as keyof IDreamPlayerResponse
                      ];

                    if (
                      typeof myStat !== "number" ||
                      typeof oppStat !== "number"
                    )
                      return null;

                    const isWin = myStat > oppStat;
                    const isLoss = oppStat > myStat;

                    return (
                      <div key={stat} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span
                            className={`text-[18px] font-black ${isWin ? "text-[#00ff66]" : "text-white/20"}`}
                          >
                            {myStat}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#aaaba7] mb-1">
                            {stat}
                          </span>
                          <span
                            className={`text-[18px] font-black ${isLoss ? "text-[#ff4444]" : "text-white/20"}`}
                          >
                            {oppStat}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full flex overflow-hidden p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-1500 ease-out ${isWin ? "bg-[#00ff66] shadow-[0_0_10px_#00ff66]" : "bg-white/10"}`}
                            style={{
                              width: `${(myStat / (myStat + oppStat)) * 100}%`,
                            }}
                          />
                          <div
                            className={`h-full rounded-full transition-all duration-1500 ease-out ${isLoss ? "bg-[#ff4444] shadow-[0_0_10px_#ff4444]" : "bg-white/10"}`}
                            style={{
                              width: `${(oppStat / (myStat + oppStat)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-6 mt-16 mb-8">
                  <button
                    onClick={resetBattle}
                    className="flex items-center gap-2 text-[10px] font-bold text-[#aaaba7] hover:text-[#00ff66] transition-colors uppercase tracking-widest"
                  >
                    <ChevronLeft size={16} /> NEW BATTLE
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
