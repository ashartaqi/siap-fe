"use client";

import { Activity } from "lucide-react";
import { Match } from "@/types/football";
import { fmtMatchDate, fmtKickoff } from "@/lib/utils/footballUtils";

export function MatchNode({ match, round }: { match: Match; round: string }) {
  const isT1Winner = match.winner === "HOME_TEAM";
  const isT2Winner = match.winner === "AWAY_TEAM";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isFinished = match.status === "FINISHED";
  const isTimed = match.status === "TIMED" || match.status === "SCHEDULED";

  return (
    <div className="rounded-xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.5)] border border-[rgba(100,160,255,0.25)] backdrop-blur-xl bg-[linear-gradient(135deg,rgba(10,25,60,0.85)_0%,rgba(5,15,40,0.92)_100%)]">
      <div className="flex justify-between items-center px-3 py-1.5 border-b border-[rgba(100,160,255,0.15)] bg-[linear-gradient(90deg,rgba(0,80,200,0.5)_0%,rgba(0,40,120,0.3)_100%)]">
        <span className="text-[#7eb8ff] text-[9px] font-bold uppercase tracking-[0.1em]">
          {round}
        </span>
        {isLive && (
          <span className="animate-pulse text-[#60aaff] text-[9px] font-black flex items-center gap-1">
            <Activity size={10} /> LIVE
          </span>
        )}
        {isFinished && (
          <span className="text-[#4a6a9a] text-[9px] font-bold">FT</span>
        )}
        {isTimed && (
          <span className="text-[#5a80b0] text-[9px] font-bold">
            {fmtMatchDate(match)}
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${isT1Winner ? "bg-[#60aaff]" : "bg-[rgba(100,160,255,0.2)]"}`}
            />
            <span
              className={`text-[13px] font-bold uppercase tracking-[-0.01em] max-w-[110px] truncate ${isT1Winner ? "text-[#e8f0ff]" : "text-[#8aabdc]"}`}
            >
              {match.home_team}
            </span>
          </div>
          <span
            className={`text-[13px] font-bold font-mono ml-2 ${isT1Winner ? "text-[#60aaff]" : "text-[#8aabdc]"}`}
          >
            {isFinished || isLive ? (match.home_team_score ?? "0") : "-"}
          </span>
        </div>

        <div className="h-px bg-[rgba(100,160,255,0.08)]" />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${isT2Winner ? "bg-[#60aaff]" : "bg-[rgba(100,160,255,0.2)]"}`}
            />
            <span
              className={`text-[13px] font-bold uppercase tracking-[-0.01em] max-w-[110px] truncate ${isT2Winner ? "text-[#e8f0ff]" : "text-[#8aabdc]"}`}
            >
              {match.away_team}
            </span>
          </div>
          <span
            className={`text-[13px] font-bold font-mono ml-2 ${isT2Winner ? "text-[#60aaff]" : "text-[#8aabdc]"}`}
          >
            {isFinished || isLive ? (match.away_team_score ?? "0") : "-"}
          </span>
        </div>

        {isTimed && (
          <div className="text-center mt-0.5">
            <span className="text-[#4a6a9a] text-[10px] font-mono">
              {fmtKickoff(match)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
