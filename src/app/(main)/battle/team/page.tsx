"use client";

import { useState, useMemo } from "react";
import { Swords, Trophy, Skull, Users, ChevronLeft } from "lucide-react";
import {
  useGetBattleUsers,
  useGetUserDreamTeam,
  useSimulateBattle,
} from "@/features/main/battle";
import type { IMatchSimulationResult } from "@/features/main/battle/apis/battle";
import { useGetDreamTeam } from "@/features/main/dashboard/hooks/useGetDreamTeam";
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { useGetFormations } from "@/features/main/football";
import { BattleTeamCard } from "@/components/ui/battle/BattleTeamCard";
import { BattleMatchReport } from "@/components/ui/battle/BattleMatchReport";
import { slotsToPlayers } from "@/lib/utils/battleUtils";

export default function TeamBattlePage() {
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [showResult, setShowResult] = useState(false);
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

  const { mutate: simulate, isPending: isSimulating } = useSimulateBattle();

  const startBattle = () => {
    if (!myTeam || !opponentTeam || !opponentId) return;
    setIsBattling(true);
    setShowResult(false);
    simulate(opponentId, {
      onSuccess: (data) => {
        setBattleResult(data);
        setIsBattling(false);
        setShowResult(true);
      },
      onError: () => setIsBattling(false),
    });
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
                  CHOOSE OPPONENT
                </span>
                <div className="relative group">
                  <select
                    onChange={(e) => setOpponentId(Number(e.target.value))}
                    value={opponentId ?? ""}
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
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-3xl font-[Bebas_Neue] text-[#00ff66] animate-bounce">
            ANALYZING TACTICS...
          </div>
          <div className="text-[10px] text-[#555] uppercase tracking-[0.5em] mt-2">
            SIMULATING MATCH SCENARIO
          </div>
        </div>
      )}

      {/* Results */}
      {showResult &&
        battleResult &&
        opponentTeam &&
        myFormation &&
        opponentFormation &&
        currentUser && (
          <div className="w-full animate-in fade-in zoom-in duration-1000">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={resetBattle}
                className="flex items-center gap-2 text-[10px] font-bold text-[#aaaba7] hover:text-[#00ff66] transition-colors"
              >
                <ChevronLeft size={16} /> BACK
              </button>
              <div
                className={`text-5xl font-[Bebas_Neue] uppercase tracking-tighter ${
                  battleResult.winner === "me"
                    ? "text-[#00ff66]"
                    : battleResult.winner === "opponent"
                      ? "text-[#ff4444]"
                      : "text-[#aaaba7]"
                }`}
              >
                {battleResult.score1} – {battleResult.score2}
              </div>
              <div className="w-10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
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

            <div className="flex flex-col items-center gap-6">
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

              <BattleMatchReport
                stats={battleResult.stats}
                log={battleResult.log}
              />

              <p className="text-[#aaaba7] font-bold tracking-widest uppercase text-sm mt-4">
                REWARD: +{battleResult.reward} BB
              </p>

              <button
                onClick={resetBattle}
                className="px-12 py-4 bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
              >
                RETRY BATTLE
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
