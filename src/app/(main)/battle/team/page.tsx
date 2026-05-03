"use client";

import { useState, useMemo, useCallback } from "react";
import { Skull } from "lucide-react";
import {
  useGetBattleUsers,
  useGetUserDreamTeam,
  useSimulateTeamBattle,
} from "@/features/main/battle";
import type { IMatchSimulationResult } from "@/features/main/battle/apis/battle";
import { useGetDreamTeam } from "@/features/main/dashboard/hooks/useGetDreamTeam";
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { useGetFormations } from "@/features/main/football";
import { BattleLoadingScreen } from "@/components/ui/battle/BattleLoadingScreen";
import { TeamBattleSetup } from "@/components/ui/battle/TeamBattleSetup";
import { TeamBattleResult } from "@/components/ui/battle/TeamBattleResult";
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

  const handleMatchmake = useCallback(() => {
    const pool = battleUsers.filter(
      (u) => u.username !== currentUser?.username,
    );
    if (pool.length === 0) return;
    setOpponentId(pool[Math.floor(Math.random() * pool.length)].id);
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

      {isBattling && (
        <BattleLoadingScreen
          title="ANALYZING TACTICS..."
          subtitle="SIMULATING MATCH SCENARIO"
        />
      )}

      {!showResult && !isBattling && myFormation && currentUser && (
        <TeamBattleSetup
          myTeam={myTeam}
          myFormation={myFormation}
          myPlayers={myPlayers}
          myUsername={currentUser.username}
          opponentId={opponentId}
          battleUsers={battleUsers}
          loadingOpponent={loadingOpponent}
          isSimulating={isSimulating}
          onMatchmake={handleMatchmake}
          onStartBattle={startBattle}
        />
      )}

      {showResult &&
        battleResult &&
        opponentTeam &&
        myFormation &&
        opponentFormation &&
        currentUser && (
          <TeamBattleResult
            battleResult={battleResult}
            myTeam={myTeam}
            opponentTeam={opponentTeam}
            myFormation={myFormation}
            opponentFormation={opponentFormation}
            myPlayers={myPlayers}
            opponentPlayers={opponentPlayers}
            myUsername={currentUser.username}
            opponentUsername={
              battleUsers.find((u) => u.id === opponentId)?.username ??
              "Opponent"
            }
            simDone={simDone}
            onSimulationComplete={handleSimulationComplete}
            onReset={resetBattle}
          />
        )}
    </div>
  );
}
