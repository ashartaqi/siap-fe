"use client";

import { useState } from "react";
import { Swords, Skull } from "lucide-react";
import {
  useGetBattleUsers,
  useGetUserCustomPlayer,
} from "@/features/main/battle";
import { useGetDreamPlayer } from "@/features/main/dashboard/hooks/useGetDreamPlayer";
import { comparePlayerStats } from "@/lib/utils/battleUtils";
import { PlayerBattleSetup } from "@/components/ui/battle/PlayerBattleSetup";
import { PlayerBattleResult } from "@/components/ui/battle/PlayerBattleResult";

export default function PlayerBattlePage() {
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [result, setResult] = useState<ReturnType<
    typeof comparePlayerStats
  > | null>(null);

  const { data: users = [] } = useGetBattleUsers();
  const { data: myPlayer } = useGetDreamPlayer();
  const {
    data: opponentPlayer,
    isLoading: loadingOpponent,
    isError: errorOpponent,
  } = useGetUserCustomPlayer(opponentId);

  const battleUsers = users.filter((u) => u.has_player);

  const startBattle = () => {
    if (!myPlayer || !opponentPlayer) return;
    setIsBattling(true);
    setTimeout(() => {
      setResult(comparePlayerStats(myPlayer, opponentPlayer));
      setIsBattling(false);
    }, 2500);
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
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
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
          onReset={resetBattle}
        />
      )}
    </div>
  );
}
