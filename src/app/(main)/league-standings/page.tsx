"use client";

import React, { useState } from "react";
import { Carousel } from "@/components/common/Carousel";
import { StandingsTable } from "@/components/ui/league-standings/StandingsTable";
import { FixturesPanel } from "@/components/ui/league-standings/FixturesPanel";
import {
  LEAGUES_WITH_ACCENT as LEAGUES,
  CURRENT_SEASON,
} from "@/lib/constants";
import { useGetStandings } from "@/features/main/football";

export default function StandingsPage() {
  const [leagueIdx, setLeagueIdx] = useState(0);

  const league = LEAGUES[leagueIdx];

  const { data: standings = [], isLoading: loading } = useGetStandings(
    league.key,
  );

  return (
    <div
      className="min-h-screen py-8 px-5 max-w-[1280px] mx-auto"
      style={{ "--accent": league.accent } as React.CSSProperties}
    >
      <div className="flex items-baseline gap-4 mb-8">
        <h1 className="text-[clamp(1.4rem,3vw,2rem)] font-extrabold tracking-[-0.02em] text-[#e8e8ec]">
          Standings
        </h1>
        <span className="text-[0.8rem] text-[#6b6b78] font-mono">
          {CURRENT_SEASON}
        </span>
      </div>

      <Carousel
        currentIndex={leagueIdx}
        totalItems={LEAGUES.length}
        onIndexChange={setLeagueIdx}
        title={
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.6rem] font-bold font-mono tracking-[0.05em] text-white shrink-0"
              style={{ background: league.accent }}
            >
              {league.badge}
            </div>
            <div>
              <div className="text-[0.95rem] font-bold tracking-[-0.01em]">
                {league.label}
              </div>
              <div className="text-[0.72rem] text-[#6b6b78] font-mono mt-px">
                Season {CURRENT_SEASON}
              </div>
            </div>
          </div>
        }
        headerClassName="mb-4"
        dotsContainerClassName="mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5 items-start">
          <div className="bg-[#111114] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
            <div
              className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(255,255,255,0.07)]"
              style={{
                background: `linear-gradient(135deg, ${league.accent}22 0%, transparent 60%)`,
              }}
            >
              <div className="flex gap-4 flex-wrap">
                {[
                  { color: "#3b82f6", label: "Champions League" },
                  { color: "#f59e0b", label: "Europa League" },
                  { color: "#10b981", label: "Conference League" },
                  { color: "#ef4444", label: "Relegation" },
                ].map(({ color, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-[0.68rem] text-[#6b6b78] font-mono"
                  >
                    <span
                      className="w-2 h-2 rounded-[2px] inline-block"
                      style={{ background: color }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-4 flex flex-col gap-2">
                {[...Array(18)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 rounded-md bg-[linear-gradient(90deg,#1a1a1e_25%,#222226_50%,#1a1a1e_75%)] bg-[length:200%_100%] animate-[shimmer_1.3s_infinite]"
                  />
                ))}
              </div>
            ) : (
              <StandingsTable rows={standings} leagueKey={league.key} />
            )}
          </div>

          <FixturesPanel leagueKey={league.key} />
        </div>
      </Carousel>
    </div>
  );
}
