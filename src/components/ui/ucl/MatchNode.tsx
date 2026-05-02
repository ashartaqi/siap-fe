"use client";

import { Match } from "@/features/main/football/types";
import { MatchCard } from "@/components/common/MatchCard";
import { useGetUserVotes } from "@/features/main/football";

export function MatchNode({ match, round }: { match: Match; round: string }) {
  const { data: userVotes = [] } = useGetUserVotes();
  const votedFixtureIds = new Set(userVotes.map((v) => v.fixture_id));

  return (
    <div className="w-full">
      <MatchCard
        m={match}
        votedFixtureIds={votedFixtureIds}
        showRound={round}
        theme="blue"
      />
    </div>
  );
}
