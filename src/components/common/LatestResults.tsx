"use client";

import React from "react";
import { BarChart } from "lucide-react";
import { formatShortDate, leagueName } from "@/lib/utils/footballUtils";
import { useGetLatestResults } from "@/features/main/football";

export function LatestResults() {
  const { data: results, isLoading: loading } = useGetLatestResults();

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
            key={m.id}
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
                  <span
                    className={
                      draw ? "" : homeWon ? "text-[#00fe66]" : "text-[#ff7351]"
                    }
                  >
                    {m.home_team}
                  </span>{" "}
                  {m.home_team_score !== null && m.home_team_score !== undefined
                    ? m.home_team_score
                    : "-"}{" "}
                  –{" "}
                  {m.away_team_score !== null && m.away_team_score !== undefined
                    ? m.away_team_score
                    : "-"}{" "}
                  <span className="text-on-surface-variant opacity-80 font-medium">
                    {m.away_team}
                  </span>
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
