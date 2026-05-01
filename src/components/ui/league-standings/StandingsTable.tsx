"use client";

import React from "react";
import { StandingRow } from "@/features/main/football/types";
import { getQualification } from "@/lib/utils/footballUtils";
import { PositionBadge } from "./PositionBadge";
import { abbrev } from "@/lib/utils/footballUtils";

function parseForm(form?: string | string[]): string[] {
  if (!form) return [];
  const formArray = Array.isArray(form) ? form : form.split(",");
  return formArray
    .map((s) => {
      const str = s.trim().toUpperCase();
      if (str.startsWith("W")) return "W";
      if (str.startsWith("D")) return "D";
      if (str.startsWith("L")) return "L";
      return str;
    })
    .filter((s) => s === "W" || s === "D" || s === "L")
    .slice(0, 5);
}

function FormDot({ result }: { result: string }) {
  const isWin = result === "W";
  const isDraw = result === "D";
  const isLoss = result === "L";

  return (
    <span
      className={[
        "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold font-mono",
        isWin
          ? "bg-[#22c55e] text-white"
          : isDraw
            ? "bg-[#a1a1aa] text-white"
            : isLoss
              ? "bg-[#ef4444] text-white"
              : "bg-[rgba(255,255,255,0.06)] text-[#9ca3af]",
      ].join(" ")}
      title={result}
    >
      {result === "W" ? "✓" : result === "D" ? "–" : "✕"}
    </span>
  );
}

export function StandingsTable({
  rows,
  leagueKey,
}: {
  rows: StandingRow[];
  leagueKey: string;
}) {
  return (
    <div className="overflow-x-auto custom-scrollbar-thin">
      <table className="w-full border-collapse text-[0.75rem] md:text-[0.82rem] min-w-[600px] md:min-w-0">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.07)]">
            <th className="px-2 py-[0.6rem] text-center text-[0.6rem] md:text-[0.68rem] font-semibold text-[#6b6b78] font-mono uppercase tracking-[0.06em]">
              #
            </th>
            <th className="px-2 py-[0.6rem] text-left pl-3 text-[0.6rem] md:text-[0.68rem] font-semibold text-[#6b6b78] font-mono uppercase tracking-[0.06em]">
              Club
            </th>
            {["P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h) => (
              <th
                key={h}
                className={`px-2 py-[0.6rem] text-center text-[0.6rem] md:text-[0.68rem] font-semibold text-[#6b6b78] font-mono uppercase tracking-[0.06em] ${["GF", "GA"].includes(h) ? "hidden sm:table-cell" : ""}`}
              >
                {h}
              </th>
            ))}
            <th className="px-2 py-[0.6rem] text-center text-[0.6rem] md:text-[0.68rem] font-semibold text-[#6b6b78] font-mono uppercase tracking-[0.06em] hidden md:table-cell">
              Last 5
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const gd = r.goal_difference ?? 0;
            const form = parseForm(r.forms || r.form);
            return (
              <tr
                key={r.id}
                className="border-b border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                style={
                  {
                    "--row-i": i,
                    animationDelay: `${i * 28}ms`,
                  } as React.CSSProperties
                }
              >
                <td className="px-2 py-[0.65rem] text-center font-mono text-[0.75rem] md:text-[0.8rem]">
                  <PositionBadge
                    pos={r.position}
                    qual={getQualification(r.position, leagueKey, rows.length)}
                  />
                </td>
                <td className="px-2 py-[0.65rem] pl-3 text-left font-mono text-[0.75rem] md:text-[0.8rem]">
                  <div className="flex items-center gap-2">
                    {r.logo_url ? (
                      <img
                        src={r.logo_url}
                        alt={r.team_name}
                        className="w-4 h-4 object-contain shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-4 h-4 shrink-0" />
                    )}
                    <span className="hidden sm:inline truncate max-w-[120px] md:max-w-none">
                      {r.team_name}
                    </span>
                    <span className="sm:hidden">{abbrev(r.team_name)}</span>
                  </div>
                </td>
                <td className="px-2 py-[0.65rem] text-center font-mono text-[0.75rem] md:text-[0.8rem]">
                  {r.played_games}
                </td>
                <td className="px-2 py-[0.65rem] text-center font-mono text-[0.75rem] md:text-[0.8rem]">
                  {r.won}
                </td>
                <td className="px-2 py-[0.65rem] text-center font-mono text-[0.75rem] md:text-[0.8rem]">
                  {r.draw}
                </td>
                <td className="px-2 py-[0.65rem] text-center font-mono text-[0.75rem] md:text-[0.8rem]">
                  {r.lost}
                </td>
                <td className="px-2 py-[0.65rem] text-center font-mono text-[0.75rem] md:text-[0.8rem] hidden sm:table-cell">
                  {r.goals_for}
                </td>
                <td className="px-2 py-[0.65rem] text-center font-mono text-[0.75rem] md:text-[0.8rem] hidden sm:table-cell">
                  {r.goals_against}
                </td>
                <td
                  className={`px-2 py-[0.65rem] text-center font-mono text-[0.75rem] md:text-[0.8rem] ${gd > 0 ? "text-[#4ade80]" : gd < 0 ? "text-[#f87171]" : ""}`}
                >
                  {gd > 0 ? `+${gd}` : gd}
                </td>
                <td className="px-2 py-[0.65rem] text-center font-mono text-[0.75rem] md:text-[0.8rem] font-bold text-[#fcfcf8]">
                  {r.points}
                </td>
                <td className="px-2 py-[0.65rem] text-center hidden md:table-cell">
                  <div className="flex justify-center gap-1 min-w-[120px]">
                    {form.length > 0 ? (
                      form.map((result, idx) => (
                        <FormDot key={`${r.id}-form-${idx}`} result={result} />
                      ))
                    ) : (
                      <span className="text-[#6b6b78] text-[0.75rem] font-mono">
                        —
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
