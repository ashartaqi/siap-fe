"use client";

import { useState } from "react";
import { Skull } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { TAxiosError } from "@/types/api";
import {
  useGetBattleUsers,
  useGetUserCustomPlayer,
  useSimulatePlayerBattle,
} from "@/features/main/battle";
import type { IMatchSimulationResult } from "@/features/main/battle/apis/battle";
import { useGetDreamPlayer } from "@/features/main/dashboard/hooks/useGetDreamPlayer";
import { PlayerBattleSetup } from "@/components/ui/battle/PlayerBattleSetup";
import { PlayerBattleResult } from "@/components/ui/battle/PlayerBattleResult";
import { BattleLoadingScreen } from "@/components/ui/battle/BattleLoadingScreen";

export default function PlayerBattlePage() {
  const queryClient = useQueryClient();
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [result, setResult] = useState<IMatchSimulationResult | null>(null);

  const { data: users = [] } = useGetBattleUsers();
  const { data: myPlayer } = useGetDreamPlayer();
  const {
    data: opponentPlayer,
    isLoading: loadingOpponent,
    isError: errorOpponent,
  } = useGetUserCustomPlayer(opponentId);

  const simulateBattleMutation = useSimulatePlayerBattle();

  const battleUsers = users.filter((u) => u.has_player && u.has_team);

  const startBattle = () => {
    if (!myPlayer || !opponentPlayer || !opponentId) return;
    setIsBattling(true);

    simulateBattleMutation.mutate(opponentId, {
      onSuccess: (data) => {
        setTimeout(() => {
          setResult(data);
          setIsBattling(false);
          queryClient.invalidateQueries({ queryKey: ["user-me"] });
        }, 1500);
      },
      onError: (err: Error) => {
        const axiosErr = err as TAxiosError;
        console.error("Battle simulation failed:", axiosErr);
        const errorMessage =
          axiosErr.response?.data?.detail ||
          "Failed to initiate battle. Both players must have a Dream Team.";
        alert(errorMessage);
        setIsBattling(false);
      },
    });
  };

  const resetBattle = () => {
    setOpponentId(null);
    setResult(null);
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

      {isBattling && (
        <BattleLoadingScreen
          title="POWERING UP..."
          subtitle="COMPARING SKILL ATTRIBUTES"
        />
      )}

      {!isBattling && !result && (
        <PlayerBattleSetup
          myPlayer={myPlayer}
          opponentPlayer={opponentPlayer}
          battleUsers={battleUsers}
          opponentId={opponentId}
          loadingOpponent={loadingOpponent}
          errorOpponent={errorOpponent}
          onSelectOpponent={setOpponentId}
          onStartBattle={startBattle}
        />
      )}

      {!isBattling && result && opponentPlayer && (
        <PlayerBattleResult
          myPlayer={myPlayer}
          opponentPlayer={opponentPlayer}
          winner={result.winner}
          battleResult={result}
          onReset={resetBattle}
        />
      )}
    </div>
  );
}
