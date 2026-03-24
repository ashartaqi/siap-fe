"use client";

import React from "react";
import {
  statCards,
  goalsTrend,
  fixtures,
  standings,
  topScorers,
} from "@/lib/mockData";
import { StatCard } from "@/components/ui/dashboard/StatCard";
import { GoalsTrendChart } from "@/components/ui/dashboard/GoalsTrendChart";
import { FixturesList } from "@/components/ui/dashboard/FixturesList";
import { StandingsTable } from "@/components/ui/dashboard/StandingsTable";
import { TopScorers } from "@/components/ui/dashboard/TopScorers";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <StatCard
            key={i}
            label={s.label}
            value={s.value}
            sub={s.sub}
            delta={s.delta}
            up={s.up}
            live={s.live}
            index={i}
          />
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-[1fr_340px] gap-5">
        <GoalsTrendChart data={goalsTrend} />
        <FixturesList fixtures={fixtures} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-[1fr_340px] gap-5">
        <StandingsTable standings={standings} />
        <TopScorers topScorers={topScorers} />
      </div>
    </div>
  );
}
