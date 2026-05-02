"use client";

import { useState, useMemo, useCallback } from "react";
import { Swords, Trophy, Skull, Users, ChevronLeft } from "lucide-react";
import {
  useGetBattleUsers,
  useGetUserDreamTeam,
  useSimulateTeamBattle,
} from "@/features/main/battle";
import type { IMatchSimulationResult } from "@/features/main/battle/apis/battle";
import { useGetDreamTeam } from "@/features/main/dashboard/hooks/useGetDreamTeam";
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { useGetFormations } from "@/features/main/football";
import { BattleTeamCard } from "@/components/ui/battle/BattleTeamCard";
import { BattleMatchReport } from "@/components/ui/battle/BattleMatchReport";
import { BattleLoadingScreen } from "@/components/ui/battle/BattleLoadingScreen";
import { slotsToPlayers } from "@/lib/utils/battleUtils";
import { useRewards } from "@/components/providers/RewardProvider";

export default function TeamBattlePage() {
  const { addReward } = useRewards();
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [simDone, setSimDone] = useState(false);
  const [battleResult, setBattleResult] =
    useState<IMatchSimulationResult | null>(null);

  const { data: users = [] } = useGetBattleUsers();
  const { data: myTeam } = useGetDreamTeam();
  const { data: opponentTeam, isLoading: loadingOpponent } =
    useGetUserDreamTeam(opponentId);
  const { data: currentUser } = useGetUser();
  const { data: formations = [] } = useGetFormations();

  const battleUsers = users.filter((u) => u.has_team);
  const myPlayers = useMemo(
    () => (myTeam ? slotsToPlayers(myTeam.slots) : {}),
    [myTeam],
  );
  const opponentPlayers = useMemo(
    () => (opponentTeam ? slotsToPlayers(opponentTeam.slots) : {}),
    [opponentTeam],
  );
  const myFormation =
    formations.find((f) => f.id === myTeam?.formation) ?? formations[0];
  const opponentFormation =
    formations.find((f) => f.id === opponentTeam?.formation) ?? formations[0];

  const { mutate: simulate, isPending: isSimulating } = useSimulateTeamBattle();

  const handleMatchmaking = useCallback(() => {
    const pool = battleUsers.filter(
      (u) => u.username !== currentUser?.username,
    );
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setOpponentId(pool[randomIndex].id);
  }, [battleUsers, currentUser?.username]);

  const startBattle = () => {
    if (!myTeam || !opponentTeam || !opponentId) return;
    setIsBattling(true);
    setShowResult(false);
    setSimDone(false);
    simulate(opponentId, {
      onSuccess: (data) => {
        setBattleResult(data);
        setIsBattling(false);
        setShowResult(true);
      },
      onError: () => setIsBattling(false),
    });
  };

  const handleSimulationComplete = () => {
    setSimDone(true);
    if (battleResult && battleResult.reward > 0) {
      const msg =
        battleResult.winner === "me"
          ? "Victory Bonus!"
          : battleResult.winner === "draw"
            ? "Hard-fought Draw Reward"
            : "Participation Reward";
      addReward(battleResult.reward, msg);
    }
  };

  const resetBattle = () => {
    setOpponentId(null);
    setBattleResult(null);
    setShowResult(false);
    setSimDone(false);
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

      {/* Pre-battle */}
      {!showResult && !isBattling && (
        <div className="flex flex-col items-center gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center max-w-5xl">
            <div className="animate-in slide-in-from-left-8 duration-500">
              {myFormation && currentUser && (
                <BattleTeamCard
                  variant="preview"
                  side="me"
                  username={currentUser.username}
                  totalScore={myTeam.total_score}
                  formation={myFormation}
                  players={myPlayers}
                />
              )}
            </div>

            <div className="bg-[#121212] border border-[rgba(255,255,255,0.05)] p-8 rounded-3xl flex flex-col gap-8 shadow-2xl animate-in slide-in-from-right-8 duration-500">
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#ff4444] uppercase mb-4 block">
                  ARENA MATCHMAKING
                </span>
                <button
                  onClick={handleMatchmaking}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-8 text-[13px] text-[#fcfcf8] hover:border-[#00ff66] hover:bg-[#1f1f1f] transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,102,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
                  <Users
                    size={24}
                    className="text-[#555] group-hover:text-[#00ff66] transition-all group-hover:scale-110"
                  />
                  <span className="font-bold tracking-widest uppercase">
                    {opponentId
                      ? battleUsers.find((u) => u.id === opponentId)?.username
                      : "Find Random Opponent"}
                  </span>
                  {opponentId && (
                    <span className="text-[9px] text-[#00ff66] animate-pulse">
                      RIVAL ACQUIRED
                    </span>
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-[11px] text-[#aaaba7] text-center italic">
                  &quot;Only those who have crafted their Dream Team can enter
                  the arena.&quot;
                </p>
                <button
                  onClick={startBattle}
                  disabled={!opponentId || loadingOpponent || isSimulating}
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
      )}

      {/* Loading */}
      {isBattling && (
        <BattleLoadingScreen
          title="ANALYZING TACTICS..."
          subtitle="SIMULATING MATCH SCENARIO"
        />
      )}

      {/* Results */}
      {showResult &&
        battleResult &&
        opponentTeam &&
        myFormation &&
        opponentFormation &&
        currentUser && (
          <div className="w-full animate-in fade-in zoom-in duration-700">
            {/* Header row: back + score */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={resetBattle}
                className="flex items-center gap-2 text-[10px] font-bold text-[#aaaba7] hover:text-[#00ff66] transition-colors"
              >
                <ChevronLeft size={16} /> BACK
              </button>

              {/* Score hidden until simulation ends */}
              {simDone ? (
                <div
                  className={`text-5xl font-[Bebas_Neue] uppercase tracking-tighter animate-in fade-in zoom-in duration-500 ${
                    battleResult.winner === "me"
                      ? "text-[#00ff66]"
                      : battleResult.winner === "opponent"
                        ? "text-[#ff4444]"
                        : "text-[#aaaba7]"
                  }`}
                >
                  {battleResult.score1} – {battleResult.score2}
                </div>
              ) : (
                <div className="text-5xl font-[Bebas_Neue] uppercase tracking-tighter text-[#333] select-none">
                  ? – ?
                </div>
              )}
              <div className="w-10" />
            </div>

            {/* Simulation log — always shown first */}
            <div className="flex justify-center mb-10">
              <BattleMatchReport
                stats={battleResult.stats}
                log={battleResult.log}
                onSimulationComplete={handleSimulationComplete}
              />
            </div>

            {/* Team cards — revealed after simulation finishes */}
            {simDone && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <BattleTeamCard
                    variant="result"
                    side="me"
                    username={currentUser.username}
                    totalScore={myTeam.total_score}
                    formation={myFormation}
                    players={myPlayers}
                    isWinner={battleResult.winner === "me"}
                  />
                  <BattleTeamCard
                    variant="result"
                    side="opponent"
                    username={
                      battleUsers.find((u) => u.id === opponentId)?.username ??
                      "Opponent"
                    }
                    totalScore={opponentTeam.total_score}
                    formation={opponentFormation}
                    players={opponentPlayers}
                    isWinner={battleResult.winner === "opponent"}
                  />
                </div>

                <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
                  {battleResult.winner === "me" ? (
                    <div className="flex flex-col items-center gap-2 animate-bounce">
                      <Trophy size={60} className="text-[#00ff66]" />
                      <p className="text-[#00ff66] font-bold tracking-widest uppercase text-sm">
                        YOU DOMINATED THE PITCH
                      </p>
                    </div>
                  ) : battleResult.winner === "opponent" ? (
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
                    REWARD: +{battleResult.reward} BB
                  </p>

                  <button
                    onClick={resetBattle}
                    className="px-12 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                  >
                    RETRY BATTLE
                  </button>
                </div>
              </>
            )}
          </div>
        )}
    </div>
  );
}
