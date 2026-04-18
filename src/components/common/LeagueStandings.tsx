"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CarouselHeader, CarouselDots } from "@/components/common/Carousel";
import { BASE, STANDING_LEAGUES, abbrev } from "@/lib/footballUtils";
import { StandingRow } from "@/types/football";

// ─── Dashboard Variant (Compact Carousel) ───────────────────────────────────

export function LeagueTableCarousel() {
  const [current, setCurrent] = useState(0);
  const [rows, setRows] = useState<StandingRow[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ok">("loading");
  const cache = React.useRef<Record<string, StandingRow[]>>({});

  const load = useCallback(async (idx: number) => {
    const key = STANDING_LEAGUES[idx].key;
    setStatus("loading");
    if (cache.current[key]) {
      setRows(cache.current[key]);
      setStatus("ok");
      return;
    }
    try {
      const res = await fetch(`${BASE}/standings?limit=20&league=${key}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const normalized: StandingRow[] = Array.isArray(data) ? data : [];
      cache.current[key] = normalized;
      setRows(normalized);
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load(current);
  }, [current, load]);

  const league = STANDING_LEAGUES[current];

  return (
    <div>
      <CarouselHeader
        title={
          <div className="flex items-center gap-2">
            <Link href="/league-standings">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest hover:text-primary-container transition-colors cursor-pointer">
                League Table
              </h2>
            </Link>
            <span className="text-[9px] font-bold text-primary-container px-2 py-0.5 bg-primary-container/10 border border-primary-container/20 rounded uppercase tracking-widest">
              {league.badge}
            </span>
          </div>
        }
        currentIndex={current}
        totalItems={STANDING_LEAGUES.length}
        onIndexChange={setCurrent}
        className="mb-3"
      />
      <div className="bg-surface-container-low rounded-lg overflow-hidden border border-[#474845]/10">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-surface-container-low">
            <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-[#474845]/10">
              <th className="px-3 py-2 font-bold">Pos</th>
              <th className="px-3 py-2 font-bold">Club</th>
              <th className="px-3 py-2 font-bold text-center">P</th>
              <th className="px-3 py-2 font-bold text-right">Pts</th>
            </tr>
          </thead>
        </table>
        <div
          className="overflow-y-auto league-scroll"
          style={{ maxHeight: "260px" }}
        >
          <table className="w-full text-left">
            <tbody className="text-xs">
              {status === "loading" && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-[10px] uppercase tracking-widest text-on-surface-variant"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {status === "error" && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-[10px] uppercase tracking-widest text-error"
                  >
                    Failed to load
                  </td>
                </tr>
              )}
              {status === "ok" &&
                rows.map((r) => {
                  const pos = r.position;
                  const total = rows.length;
                  const qual = getQualification(pos, league.key, total);
                  const isRel = qual === "relegation";

                  let rowBg = isRel ? "bg-error/5" : "";
                  if (qual === "champions") rowBg = "bg-blue-500/40";
                  else if (qual === "europa") rowBg = "bg-orange-400/40";
                  else if (qual === "conference") rowBg = "bg-green-500/40";

                  return (
                    <tr
                      key={r.id}
                      className={`border-b border-[#474845]/5 ${rowBg}`}
                    >
                      <td
                        className={`px-3 py-2 font-headline font-bold ${pos === 1 ? "text-primary-container" : isRel ? "text-error" : "text-on-surface-variant"}`}
                      >
                        {String(pos).padStart(2, "0")}
                      </td>
                      <td
                        className={`px-3 py-2 font-medium uppercase tracking-tighter ${isRel ? "opacity-60" : ""}`}
                      >
                        {r.team_name}
                      </td>
                      <td className="px-3 py-2 text-center text-on-surface-variant">
                        {r.played_games}
                      </td>
                      <td
                        className={`px-3 py-2 text-right font-bold ${pos === 1 ? "text-primary-container" : ""}`}
                      >
                        {r.points}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <CarouselDots
          currentIndex={current}
          totalItems={STANDING_LEAGUES.length}
          onIndexChange={setCurrent}
          className="py-2 border-t border-[#474845]/10"
        />
        <p className="text-center text-[9px] uppercase tracking-widest text-on-surface-variant pb-2">
          {league.label}
        </p>
      </div>
    </div>
  );
}

// ─── Full Page Variant (For /league-standings) ──────────────────────────────

export function getQualification(
  pos: number,
  leagueKey: string,
  totalTeams: number,
) {
  let clLimit = 4;
  let elLimit = [5];
  let colLimit = 6;

  if (leagueKey === "PL") {
    clLimit = 5;
    elLimit = [6];
    colLimit = 7;
  } else if (leagueKey === "FL1") {
    clLimit = 3;
    elLimit = [4];
    colLimit = 5;
  } else if (leagueKey === "PPL") {
    clLimit = 2;
    elLimit = [3, 4];
    colLimit = 5;
  }

  if (pos > totalTeams - 3) return "relegation";

  if (pos <= clLimit) return "champions";
  if (elLimit.includes(pos)) return "europa";
  if (pos === colLimit) return "conference";
  return "neutral";
}

export function PositionBadge({ pos, qual }: { pos: number; qual: string }) {
  if (qual === "champions")
    return <span className="pos-badge champions">{pos}</span>;
  if (qual === "europa") return <span className="pos-badge europa">{pos}</span>;
  if (qual === "conference")
    return <span className="pos-badge conference">{pos}</span>;
  if (qual === "relegation")
    return <span className="pos-badge relegation">{pos}</span>;
  return <span className="pos-badge neutral">{pos}</span>;
}

export function StandingsTable({
  rows,
  leagueKey,
}: {
  rows: StandingRow[];
  leagueKey: string;
}) {
  return (
    <div className="table-wrap">
      <table className="standings-table">
        <thead>
          <tr>
            <th className="col-pos">#</th>
            <th className="col-team">Club</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th className="col-pts">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ "--row-i": i } as React.CSSProperties}>
              <td>
                <PositionBadge
                  pos={r.position}
                  qual={getQualification(r.position, leagueKey, rows.length)}
                />
              </td>
              <td className="col-team">
                <span className="team-abbrev">{abbrev(r.team_name)}</span>
                <span className="team-full">{r.team_name}</span>
              </td>
              <td>{r.played_games}</td>
              <td>{r.won}</td>
              <td>{r.draw}</td>
              <td>{r.lost}</td>
              <td>{r.goals_for}</td>
              <td>{r.goals_against}</td>
              <td
                className={
                  (r.goal_difference ?? 0) > 0
                    ? "positive"
                    : (r.goal_difference ?? 0) < 0
                      ? "negative"
                      : ""
                }
              >
                {(r.goal_difference ?? 0) > 0
                  ? `+${r.goal_difference ?? 0}`
                  : (r.goal_difference ?? 0)}
              </td>
              <td className="col-pts">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
