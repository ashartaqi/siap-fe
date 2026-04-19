"use client";

import { useGetFixtures } from "@/features/main/football";
import { FixtureCard } from "./FixtureCard";

export function FixturesPanel({ leagueKey }: { leagueKey: string }) {
  const { data: fixtures = [], isLoading: loading } = useGetFixtures({
    league: leagueKey,
    status_filter: "SCHEDULED",
    limit: 10,
  });

  return (
    <div className="bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl p-4">
      <p className="text-[0.68rem] font-bold text-[#6b6b78] font-mono uppercase tracking-[0.1em] mb-3">
        Next Fixtures
      </p>
      {loading ? (
        <div className="flex flex-col gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[52px] rounded-lg bg-[linear-gradient(90deg,#1a1a1e_25%,#222226_50%,#1a1a1e_75%)] bg-[length:200%_100%] animate-[shimmer_1.3s_infinite]"
            />
          ))}
        </div>
      ) : fixtures.length === 0 ? (
        <p className="text-[0.8rem] text-[#6b6b78]">No upcoming fixtures.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {fixtures.map((fx, i) => (
            <FixtureCard key={fx.id ?? i} fx={fx} />
          ))}
        </div>
      )}
    </div>
  );
}
