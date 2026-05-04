"use client";

import { Match, KnockoutTie } from "@/features/main/football/types";
import { MatchCard } from "@/components/common/MatchCard";
import { useGetUserVotes } from "@/features/main/football";

export function MatchNode({
  match,
  tie,
  round,
}: {
  match?: Match;
  tie?: KnockoutTie;
  round: string;
}) {
  const { data: userVotes = [] } = useGetUserVotes();
  const votedFixtureIds = new Set(userVotes.map((v) => v.fixture_id));

  const displayMatch = tie ? tie.leg2 || tie.leg1 : match;

  if (!displayMatch) return null;

  return (
    <div className="w-full">
      <MatchCard
        m={displayMatch}
        votedFixtureIds={votedFixtureIds}
        showRound={round}
        theme="blue"
        aggregateHome={tie?.aggregate_home}
        aggregateAway={tie?.aggregate_away}
        winner={tie?.winner}
      />
    </div>
  );
}
