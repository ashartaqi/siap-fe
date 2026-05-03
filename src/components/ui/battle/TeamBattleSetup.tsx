"use client";

import { Swords, Users } from "lucide-react";
import { BattleTeamCard } from "./BattleTeamCard";
import type { IFormation } from "@/features/main/football/types";
import type {
  IDreamTeamResponse,
  SelectedPlayers,
} from "@/features/main/dashboard/types";
import type { BattleUser } from "@/features/main/battle";

interface TeamBattleSetupProps {
  myTeam: IDreamTeamResponse;
  myFormation: IFormation | undefined;
  myPlayers: SelectedPlayers;
  myUsername: string;
  opponentId: number | null;
  battleUsers: BattleUser[];
  loadingOpponent: boolean;
  isSimulating: boolean;
  onMatchmake: () => void;
  onStartBattle: () => void;
}

export function TeamBattleSetup({
  myTeam,
  myFormation,
  myPlayers,
  myUsername,
  opponentId,
  battleUsers,
  loadingOpponent,
  isSimulating,
  onMatchmake,
  onStartBattle,
}: TeamBattleSetupProps) {
  const opponentName = battleUsers.find((u) => u.id === opponentId)?.username;

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center max-w-5xl">
        <div className="animate-in slide-in-from-left-8 duration-500">
          {myFormation && (
            <BattleTeamCard
              variant="preview"
              side="me"
              username={myUsername}
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
              onClick={onMatchmake}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-8 text-[13px] text-[#fcfcf8] hover:border-[#00ff66] hover:bg-[#1f1f1f] transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,102,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
              <Users
                size={24}
                className="text-[#555] group-hover:text-[#00ff66] transition-all group-hover:scale-110"
              />
              <span className="font-bold tracking-widest uppercase">
                {opponentName ?? "Find Random Opponent"}
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
              &quot;Only those who have crafted their Dream Team can enter the
              arena.&quot;
            </p>
            <button
              onClick={onStartBattle}
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
  );
}
