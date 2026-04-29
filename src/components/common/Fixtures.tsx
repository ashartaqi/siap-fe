"use client";

import React, { useState } from "react";
import { Star, Vote, Users, CheckCircle } from "lucide-react";
import { formatMatchTime, formatShortDate } from "@/lib/utils/footballUtils";
import {
  useGetUpcomingFixtures,
  useGetUserVote,
} from "@/features/main/football";
import { VoteModal } from "./VoteModal";
import { ViewVotesModal } from "./ViewVotesModal";

function MatchCard({
  m,
  variant,
  userVoteFixtureId,
}: {
  m: import("@/types/football").Match;
  variant: "scheduled" | "finished";
  userVoteFixtureId?: number | null;
}) {
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showViewVotes, setShowViewVotes] = useState(false);

  const isVotedOn = userVoteFixtureId === Number(m.id);

  return (
    <>
      <div
        className={`flex-none w-72 bg-surface-container-low border p-4 rounded-lg neon-glow transition-all duration-300 ${
          isVotedOn
            ? "border-primary-container/40 shadow-[0_0_12px_rgba(0,255,102,0.15)]"
            : "border-[#474845]/20"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-on-surface-variant px-2 py-0.5 bg-surface-container-highest rounded uppercase">
            {variant === "scheduled"
              ? formatMatchTime(m.date ?? "")
              : formatShortDate(m.date ?? "")}
          </span>
          <div className="flex items-center gap-1.5">
            {isVotedOn && (
              <span className="flex items-center gap-1 text-[9px] font-label font-bold text-primary-container uppercase tracking-wider bg-primary-container/10 px-1.5 py-0.5 rounded">
                <CheckCircle className="w-3 h-3" />
                Your Pick
              </span>
            )}
            <Star className="w-4 h-4 text-on-surface-variant" />
          </div>
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

        {/* Vote / View Votes buttons */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-outline-variant/10">
          {variant === "scheduled" && (
            <button
              onClick={() => setShowVoteModal(true)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-label font-bold uppercase tracking-widest transition-all ${
                isVotedOn
                  ? "bg-primary-container/15 text-primary-container border border-primary-container/30 hover:bg-primary-container/25"
                  : "bg-surface-container-highest text-on-surface-variant hover:bg-primary-container/10 hover:text-primary-container border border-outline-variant/10"
              }`}
            >
              <Vote className="w-3.5 h-3.5" />
              {isVotedOn ? "Change Vote" : "Vote"}
            </button>
          )}
          <button
            onClick={() => setShowViewVotes(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-surface-container-highest text-on-surface-variant text-[10px] font-label font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors border border-outline-variant/10"
          >
            <Users className="w-3.5 h-3.5" />
            View Votes
          </button>
        </div>
      </div>

      {showVoteModal && (
        <VoteModal match={m} onClose={() => setShowVoteModal(false)} />
      )}
      {showViewVotes && (
        <ViewVotesModal match={m} onClose={() => setShowViewVotes(false)} />
      )}
    </>
  );
}

function ScrollRow({
  matches,
  isLoading,
  variant,
  emptyText,
  userVoteFixtureId,
}: {
  matches: import("@/types/football").Match[];
  isLoading: boolean;
  variant: "scheduled" | "finished";
  emptyText: string;
  userVoteFixtureId?: number | null;
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
          userVoteFixtureId={userVoteFixtureId}
        />
      ))}
    </div>
  );
}

export function FixturesStrip() {
  const { data: scheduledMatches, isLoading: scheduledLoading } =
    useGetUpcomingFixtures();
  const { data: userVote } = useGetUserVote();

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
          userVoteFixtureId={userVote?.fixture_id ?? null}
        />
      </div>
    </div>
  );
}
