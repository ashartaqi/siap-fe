"use client";

import React from "react";
import {
  useGetUpcomingFixtures,
  useGetUserVotes,
} from "@/features/main/football";
import { MatchCard } from "./MatchCard";

function ScrollRow({
  matches,
  isLoading,
  variant,
  emptyText,
  votedFixtureIds,
}: {
  matches: import("@/features/main/football/types").Match[];
  isLoading: boolean;
  variant: "scheduled" | "finished";
  emptyText: string;
  votedFixtureIds: Set<number>;
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
        <MatchCard
          key={m.id}
          m={m}
          variant={variant}
          votedFixtureIds={votedFixtureIds}
        />
      ))}
    </div>
  );
}

export function FixturesStrip() {
  const { data: scheduledMatches, isLoading: scheduledLoading } =
    useGetUpcomingFixtures();
  const { data: userVotes = [] } = useGetUserVotes();

  const votedFixtureIds = new Set(userVotes.map((v) => v.fixture_id));

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
          votedFixtureIds={votedFixtureIds}
        />
      </div>
    </div>
  );
}
