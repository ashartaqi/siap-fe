"use client";

import { Star } from "lucide-react";
import { isUpcoming, formatMatchTime } from "@/lib/utils/footballUtils";
import { useGetUpcomingFixtures } from "@/features/main/football";

export function FixturesStrip() {
  const { data: allMatches = [], isLoading: loading } =
    useGetUpcomingFixtures();

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex-none w-72 h-32 bg-surface-container-low border border-[#474845]/20 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (allMatches.length === 0) {
    return (
      <p className="text-on-surface-variant text-sm">
        No fixtures available right now.
      </p>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
      {allMatches.map((m) => {
        const upcoming = isUpcoming(m.status);
        return (
          <div
            key={`${m.league}-${m.id}`}
            className="flex-none w-72 bg-surface-container-low border border-[#474845]/20 p-4 rounded-lg neon-glow transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {upcoming ? (
                  <span className="text-[10px] font-bold text-on-surface-variant px-2 py-0.5 bg-surface-container-highest rounded uppercase">
                    {formatMatchTime(m.date ?? "")}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-on-surface-variant px-2 py-0.5 bg-surface-container-highest rounded uppercase">
                    Upcoming
                  </span>
                )}
              </div>
              <Star className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-headline font-medium text-sm truncate pr-2">
                  {m.home_team}
                </span>
                <span className="font-headline font-bold text-lg">
                  {m.home_team_score !== null && m.home_team_score !== undefined
                    ? m.home_team_score
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface/60">
                <span className="font-headline font-medium text-sm truncate pr-2">
                  {m.away_team}
                </span>
                <span className="font-headline font-bold text-lg">
                  {m.away_team_score !== null && m.away_team_score !== undefined
                    ? m.away_team_score
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
