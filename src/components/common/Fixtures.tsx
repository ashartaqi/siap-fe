"use client";

import React from "react";
import {
  useGetPredictedFixtures,
  useGetUserVotes,
} from "@/features/main/football";
import { MatchCard } from "./MatchCard";

export function FixturesStrip() {
  const { data: scheduledMatches = [], isLoading: scheduledLoading } =
    useGetPredictedFixtures();
  const { data: userVotes = [] } = useGetUserVotes();

  const votedFixtureIds = new Set(userVotes.map((v) => v.fixture_id));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-headline font-semibold text-base uppercase tracking-widest text-on-surface-variant">
          Scheduled
        </h3>
        {scheduledLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-none w-72 h-32 bg-surface-container-low border border-[#474845]/20 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : scheduledMatches.length === 0 ? (
          <p className="text-on-surface-variant text-base">
            No scheduled fixtures right now.
          </p>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
            {scheduledMatches.map((m) => (
              <MatchCard
                key={m.id}
                m={m}
                variant="scheduled"
                votedFixtureIds={votedFixtureIds}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
