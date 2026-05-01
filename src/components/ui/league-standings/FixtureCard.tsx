"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Match } from "@/types/football";
import { fmtDate, fmtTime } from "@/lib/utils/footballUtils";
import { MatchCommentsModal } from "@/components/common/MatchCommentsModal";

export function FixtureCard({ fx }: { fx: Match }) {
  const [showComments, setShowComments] = useState(false);
  const live = fx.status === "IN_PLAY" || fx.status === "PAUSED";
  const finished = fx.status === "FINISHED";

  return (
    <>
      <div
        className={`group relative border rounded-lg px-3 py-[0.6rem] transition-[border-color,background] duration-200 hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.02)] ${live ? "border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.04)]" : "border-[rgba(255,255,255,0.07)]"}`}
      >
        <div className="flex items-center justify-between mb-[0.35rem]">
          <div className="flex items-center gap-1.5">
            <span className="text-[0.65rem] text-[#6b6b78] font-mono">
              {fmtDate(fx.utc_date)}
            </span>
            {live && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-[blink_1s_infinite]" />
            )}
            {!live && !finished && (
              <span className="text-[0.65rem] text-[#6b6b78] font-mono">
                {fmtTime(fx.utc_date)}
              </span>
            )}
            {finished && (
              <span className="text-[0.6rem] font-mono text-[#4ade80]">FT</span>
            )}
          </div>

          <button
            onClick={() => setShowComments(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[rgba(255,255,255,0.05)] rounded-md text-[#aaaba7] hover:text-[#00ff66]"
          >
            <MessageSquare size={12} />
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
          <span className="text-[0.75rem] font-semibold truncate">
            {fx.home_team ?? "TBA"}
          </span>
          <span className="text-[0.75rem] font-mono font-medium text-[#6b6b78] whitespace-nowrap">
            {finished || live
              ? `${fx.home_score ?? 0} – ${fx.away_score ?? 0}`
              : "vs"}
          </span>
          <span className="text-[0.75rem] font-semibold truncate text-right">
            {fx.away_team ?? "TBA"}
          </span>
        </div>
      </div>

      {showComments && (
        <MatchCommentsModal match={fx} onClose={() => setShowComments(false)} />
      )}
    </>
  );
}
