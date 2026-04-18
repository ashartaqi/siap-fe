"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Carousel } from "@/components/common/Carousel";

import { StandingsTable } from "@/components/common/LeagueStandings";
import { FixturesPanel } from "@/components/common/Fixtures";
import { BASE, LEAGUES_WITH_ACCENT as LEAGUES } from "@/lib/footballUtils";
import { StandingRow } from "@/types/football";

// ─── Page ───────────────────────────────────────────────────────────────────

export default function StandingsPage() {
  const [leagueIdx, setLeagueIdx] = useState(0);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const league = LEAGUES[leagueIdx];

  const fetchStandings = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/standings?limit=20&league=${key}`);
      const data = await res.json();
      setStandings(Array.isArray(data) ? data : (data.standings ?? []));
    } catch {
      setStandings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStandings(league.key);
  }, [league.key, fetchStandings]);

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .standings-root *, .standings-root *::before, .standings-root *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }
        :root {
          --bg:        #0a0a0c;
          --surface:   #111114;
          --border:    rgba(255,255,255,0.07);
          --text:      #e8e8ec;
          --muted:     #6b6b78;
          --accent:    ${league.accent};
          --champions: #3b82f6;
          --europa:    #f59e0b;
          --conference: #10b981;  
          --relegation:#ef4444;
          --radius:    12px;
        }

        .standings-root {
          background: var(--bg);
          color: var(--text);
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
        }

        .page-root {
          min-height: 100vh;
          padding: 2rem 1.25rem;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .page-header {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .page-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text);
        }
        .page-sub {
          font-size: 0.8rem;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
        }

        /* ── Layout ── */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 1.25rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .content-grid { grid-template-columns: 1fr; }
        }

        /* ── League card ── */
        .league-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .league-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, var(--accent)22 0%, transparent 60%);
        }
        .league-badge {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 700;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
          color: #fff;
          flex-shrink: 0;
        }
        .league-name {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .league-season {
          font-size: 0.72rem;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
          margin-top: 1px;
        }

        /* ── Legend ── */
        .legend {
          display: flex;
          gap: 1rem;
          padding: 0.6rem 1.25rem;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.68rem;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
        }
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
        }

        /* ── Table ── */
        .table-wrap { overflow-x: auto; }

        .standings-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }
        .standings-table thead tr {
          border-bottom: 1px solid var(--border);
        }
        .standings-table th {
          padding: 0.6rem 0.5rem;
          text-align: center;
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .standings-table th.col-team,
        .standings-table td.col-team { text-align: left; padding-left: 0.75rem; }

        .standings-table tbody tr {
          border-bottom: 1px solid var(--border);
          animation: rowIn 0.3s ease both;
          animation-delay: calc(var(--row-i) * 28ms);
          transition: background 0.15s;
        }
        .standings-table tbody tr:hover { background: rgba(255,255,255,0.03); }
        .standings-table td {
          padding: 0.65rem 0.5rem;
          text-align: center;
          color: var(--text);
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
        }
        td.positive { color: #4ade80; }
        td.negative { color: #f87171; }

        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Position badges ── */
        .pos-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 5px;
          font-size: 0.72rem;
          font-weight: 700;
          font-family: 'DM Mono', monospace;
        }
        .pos-badge.champions  { background: rgba(59,130,246,0.18); color: #93c5fd; border: 1px solid rgba(59,130,246,0.35); }
        .pos-badge.europa     { background: rgba(245,158,11,0.15); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
        .pos-badge.conference { background: rgba(16,185,129,0.15); color: #2ad432ff; border: 1px solid rgba(16,185,129,0.3); }
        .pos-badge.relegation { background: rgba(239,68,68,0.15);  color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }
        .pos-badge.neutral    { color: var(--muted); }

        /* ── Team name ── */
        .team-abbrev { display: none; }
        @media (max-width: 520px) {
          .team-full   { display: none; }
          .team-abbrev { display: inline; }
        }

        /* ── Skeleton ── */
        .skeleton-table {
          padding: 0.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .skeleton-row {
          height: 36px;
          border-radius: 6px;
          background: linear-gradient(90deg, #1a1a1e 25%, #222226 50%, #1a1a1e 75%);
          background-size: 200% 100%;
          animation: shimmer 1.3s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Fixtures panel ── */
        .fixtures-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem;
        }
        .panel-heading {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .fixture-list { display: flex; flex-direction: column; gap: 0.5rem; }

        .fixture-card {
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .fixture-card:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.02); }
        .fixture-card.live { border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.04); }

        .fixture-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.35rem;
        }
        .fixture-date {
          font-size: 0.65rem;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
        }
        .fixture-time {
          font-size: 0.65rem;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
        }
        .fixture-ft {
          font-size: 0.6rem;
          font-family: 'DM Mono', monospace;
          color: #4ade80;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          animation: blink 1s infinite;
        }
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0.2 } }

        .fixture-teams {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 0.4rem;
        }
        .fixture-team {
          font-size: 0.75rem;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .fixture-team.away { text-align: right; }
        .fixture-score {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--muted);
          white-space: nowrap;
        }

        .skeleton-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .skeleton-item {
          height: 52px;
          border-radius: 8px;
          background: linear-gradient(90deg, #1a1a1e 25%, #222226 50%, #1a1a1e 75%);
          background-size: 200% 100%;
          animation: shimmer 1.3s infinite;
        }
        .empty-msg { font-size: 0.8rem; color: var(--muted); }

        /* ── Carousel overrides ── */
        .carousel-title-slot {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>

      <div className="page-root">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Standings</h1>
          <span className="page-sub">2024 / 25</span>
        </div>

        {/* Carousel + content */}
        <Carousel
          currentIndex={leagueIdx}
          totalItems={LEAGUES.length}
          onIndexChange={setLeagueIdx}
          title={
            <div className="carousel-title-slot">
              <div
                className="league-badge"
                style={{ background: league.accent }}
              >
                {league.badge}
              </div>
              <div>
                <div className="league-name">{league.label}</div>
                <div className="league-season">Season 2024 / 25</div>
              </div>
            </div>
          }
          headerClassName="mb-4"
          dotsContainerClassName="mt-4"
        >
          <div className="content-grid">
            {/* ── Left: Standings ── */}
            <div className="league-card">
              {/* Legend */}
              <div className="legend">
                <div className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ background: "#3b82f6" }}
                  />
                  Champions League
                </div>
                <div className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ background: "#f59e0b" }}
                  />
                  Europa League
                </div>
                <div className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ background: "#10b981" }}
                  />
                  Conference League
                </div>
                <div className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ background: "#ef4444" }}
                  />
                  Relegation
                </div>
              </div>

              {loading ? (
                <div className="skeleton-table">
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className="skeleton-row" />
                  ))}
                </div>
              ) : (
                <StandingsTable rows={standings} leagueKey={league.key} />
              )}
            </div>

            {/* ── Right: Fixtures ── */}
            <FixturesPanel leagueKey={league.key} />
          </div>
        </Carousel>
      </div>
    </>
  );
}
