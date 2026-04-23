"use client";

import { Star } from "lucide-react";
import { formatMatchTime, formatShortDate } from "@/lib/utils/footballUtils";
import {
  useGetUpcomingFixtures,
  useGetLatestResults,
} from "@/features/main/football";

function MatchCard({
  m,
  variant,
}: {
  m: import("@/types/football").Match;
  variant: "scheduled" | "finished";
}) {
  return (
    <div className="flex-none w-72 bg-surface-container-low border border-[#474845]/20 p-4 rounded-lg neon-glow transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold text-on-surface-variant px-2 py-0.5 bg-surface-container-highest rounded uppercase">
          {variant === "scheduled"
            ? formatMatchTime(m.date ?? "")
            : formatShortDate(m.date ?? "")}
        </span>
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
}

function ScrollRow({
  matches,
  isLoading,
  variant,
  emptyText,
}: {
  matches: import("@/types/football").Match[];
  isLoading: boolean;
  variant: "scheduled" | "finished";
  emptyText: string;
}) {
  if (isLoading) {
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

  if (matches.length === 0) {
    return <p className="text-on-surface-variant text-sm">{emptyText}</p>;
  }

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
      {matches.map((m) => (
        <MatchCard key={m.id} m={m} variant={variant} />
      ))}
    </div>
  );
}

export function FixturesStrip() {
  const { data: scheduledMatches, isLoading: scheduledLoading } =
    useGetUpcomingFixtures();
  const { data: finishedMatches, isLoading: finishedLoading } =
    useGetLatestResults();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-headline font-semibold text-sm uppercase tracking-widest text-on-surface-variant">
          Scheduled
        </h3>
        <ScrollRow
          matches={scheduledMatches}
          isLoading={scheduledLoading}
          variant="scheduled"
          emptyText="No scheduled fixtures right now."
        />
      </div>
    </div>
  );
}
