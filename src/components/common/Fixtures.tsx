"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  BASE,
  FIXTURE_LEAGUES,
  isUpcoming,
  formatMatchTime,
  fmtDate,
  fmtTime,
} from "@/lib/footballUtils";
import { Match } from "@/types/football";

// ─── Dashboard Variant (Horizontal Strip) ───────────────────────────────────

export function FixturesStrip() {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      Promise.resolve().then(() => {
        if (mounted) setLoading(true);
      });
      try {
        const targetStatuses = ["TIMED", "SCHEDULED", "POSTPONED"];
        const results = await Promise.allSettled(
          FIXTURE_LEAGUES.flatMap((lg) =>
            targetStatuses.map(async (status) => {
              const res = await fetch(
                `${BASE}/fixtures?limit=10&league=${lg.key}&status_filter=${status}`,
              );
              if (!res.ok) return [];
              const data: Match[] = await res.json();
              const now = new Date();
              return data
                .filter((m) => new Date(m.date ?? "") > now)
                .map((m) => ({ ...m, league: lg.key }));
            }),
          ),
        );
        if (!mounted) return;
        const merged: Match[] = [];
        for (const r of results) {
          if (r.status === "fulfilled") merged.push(...r.value);
        }
        merged.sort((a, b) => {
          const aLive = ["IN_PLAY", "PAUSED", "HALFTIME"].includes(a.status)
            ? 0
            : 1;
          const bLive = ["IN_PLAY", "PAUSED", "HALFTIME"].includes(b.status)
            ? 0
            : 1;
          if (aLive !== bLive) return aLive - bLive;
          return (
            new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime()
          );
        });
        setAllMatches(merged.slice(0, 11));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
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

  if (allMatches.length === 0) {
    return (
      <p className="text-on-surface-variant text-sm">
        No fixtures available right now.
      </p>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
      {allMatches.map((m) => {
        const upcoming = isUpcoming(m.status);
        return (
          <div
            key={`${m.league}-${m.id}`}
            className="flex-none w-72 bg-surface-container-low border border-[#474845]/20 p-4 rounded-lg neon-glow transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {upcoming ? (
                  <span className="text-[10px] font-bold text-on-surface-variant px-2 py-0.5 bg-surface-container-highest rounded uppercase">
                    {formatMatchTime(m.date ?? "")}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-on-surface-variant px-2 py-0.5 bg-surface-container-highest rounded uppercase">
                    Upcoming
                  </span>
                )}
              </div>
              <Star className="w-4 h-4 text-on-surface-variant" />
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
          </div>
        );
      })}
    </div>
  );
}

// ─── Full Page Variant (For /league-standings) ──────────────────────────────

export function FixtureCard({ fx }: { fx: Match }) {
  const live = fx.status === "IN_PLAY" || fx.status === "PAUSED";
  const finished = fx.status === "FINISHED";

  return (
    <div className={`fixture-card ${live ? "live" : ""}`}>
      <div className="fixture-meta">
        <span className="fixture-date">{fmtDate(fx.utc_date)}</span>
        {live && <span className="live-dot" />}
        {!live && !finished && (
          <span className="fixture-time">{fmtTime(fx.utc_date)}</span>
        )}
        {finished && <span className="fixture-ft">FT</span>}
      </div>
      <div className="fixture-teams">
        <span className="fixture-team home">{fx.home_team ?? "TBA"}</span>
        <span className="fixture-score">
          {finished || live
            ? `${fx.home_score ?? 0} – ${fx.away_score ?? 0}`
            : "vs"}
        </span>
        <span className="fixture-team away">{fx.away_team ?? "TBA"}</span>
      </div>
    </div>
  );
}

export function FixturesPanel({ leagueKey }: { leagueKey: string }) {
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) setLoading(true);
    });

    fetch(
      `${BASE}/fixtures?limit=10&league=${leagueKey}&status_filter=SCHEDULED`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setFixtures(Array.isArray(data) ? data : (data.fixtures ?? []));
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [leagueKey]);

  return (
    <div className="fixtures-panel">
      <p className="panel-heading">Next Fixtures</p>
      {loading ? (
        <div className="skeleton-list">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-item" />
          ))}
        </div>
      ) : fixtures.length === 0 ? (
        <p className="empty-msg">No upcoming fixtures.</p>
      ) : (
        <div className="fixture-list">
          {fixtures.map((fx, i) => (
            <FixtureCard key={fx.id ?? i} fx={fx} />
          ))}
        </div>
      )}
    </div>
  );
}
