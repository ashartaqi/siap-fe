"use client";

import React, { useEffect, useState } from "react";
import { BarChart } from "lucide-react";
import { Match } from "@/types/football";
import {
  BASE,
  FIXTURE_LEAGUES,
  formatShortDate,
  leagueName,
} from "@/lib/footballUtils";

export function LatestResults() {
  const [results, setResults] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const targetStatuses = ["FINISHED", "AWARDED"];
        const now = new Date();
        const fetched = await Promise.allSettled(
          FIXTURE_LEAGUES.flatMap((lg) =>
            targetStatuses.map(async (status) => {
              const res = await fetch(
                `${BASE}/fixtures?limit=50&league=${lg.key}&status_filter=${status}`,
              );
              if (!res.ok) return [];
              const data: Match[] = await res.json();
              return data
                .filter((m) => new Date(m.date ?? "") <= now)
                .map((m) => ({ ...m, league: lg.key }));
            }),
          ),
        );
        const merged: Match[] = [];
        for (const r of fetched) {
          if (r.status === "fulfilled") merged.push(...r.value);
        }
        merged.sort(
          (a, b) =>
            new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
        );
        setResults(merged.slice(0, 10));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-surface-container-low rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <p className="text-on-surface-variant text-sm">
        No results from the past week.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {results.map((m) => {
        const homeWon =
          m.winner === "HOME_TEAM" ||
          (m.home_team_score !== null &&
            m.home_team_score !== undefined &&
            m.away_team_score !== null &&
            m.away_team_score !== undefined &&
            m.home_team_score > m.away_team_score);
        const awayWon =
          m.winner === "AWAY_TEAM" ||
          (m.home_team_score !== null &&
            m.home_team_score !== undefined &&
            m.away_team_score !== null &&
            m.away_team_score !== undefined &&
            m.away_team_score > m.home_team_score);
        const draw =
          m.winner === "DRAW" ||
          (m.home_team_score !== null &&
            m.home_team_score !== undefined &&
            m.away_team_score !== null &&
            m.away_team_score !== undefined &&
            m.home_team_score === m.away_team_score);

        const accentColor = homeWon
          ? "border-[#00fe66]"
          : awayWon
            ? "border-[#ff7351]"
            : "border-[#474845]";
        const resultLabel = draw ? "D" : homeWon ? "W" : "L";
        const resultColor = draw
          ? "text-on-surface-variant"
          : homeWon
            ? "text-primary-container"
            : "text-error";

        return (
          <div
            key={`${m.league}-${m.id}`}
            className={`bg-surface-container-low p-4 border-l-4 ${accentColor} flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors`}
          >
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] text-on-surface-variant uppercase">
                  {formatShortDate(m.date ?? "")}
                </span>
                <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase">
                  {leagueName(m.league ?? "")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-headline font-bold ${resultColor}`}>
                  {resultLabel}
                </span>
                <span className="font-headline font-bold text-sm truncate">
                  {m.home_team}{" "}
                  {m.home_team_score !== null && m.home_team_score !== undefined
                    ? m.home_team_score
                    : "-"}{" "}
                  –{" "}
                  {m.away_team_score !== null && m.away_team_score !== undefined
                    ? m.away_team_score
                    : "-"}{" "}
                  {m.away_team}
                </span>
              </div>
            </div>
            <BarChart className="w-5 h-5 text-on-surface-variant group-hover:text-primary-container transition-colors flex-none ml-2" />
          </div>
        );
      })}
    </div>
  );
}
