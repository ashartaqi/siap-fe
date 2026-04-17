"use client";

import React from "react";
import axiosClient from "@/lib/axiosClient";
import { Star, BarChart } from "lucide-react";
import { Heart, CircleDot, ShieldCheck, Timer } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Match {
  id: number | string;
  home_team: string;
  away_team: string;
  home_team_score: number | null;
  away_team_score: number | null;
  status: string; // e.g. "FINISHED", "IN_PLAY", "TIMED", "SCHEDULED", "PAUSED", "HALFTIME"
  date: string;
  minute?: number | null;
  league?: string;
  winner?: string | null;
}

interface Club {
  id: number;
  name: string;
  league_name: string;
  nationality_name: string;
  overall: number;
  attack: number;
  midfield: number;
  defence: number;
  home_stadium: string;
  captain: string;
  logo_url: string;
}

interface StandingRow {
  id: number | string;
  position: number;
  team_name: string;
  played_games: number;
  points: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FIXTURE_LEAGUES = [
  { key: "FL1", label: "Ligue 1", badge: "L1" },
  { key: "SA", label: "Serie A", badge: "SA" },
  { key: "PL", label: "Premier League", badge: "PL" },
  { key: "PPL", label: "Primeira Liga", badge: "PPL" },
  { key: "PD", label: "La Liga", badge: "LL" },
  { key: "BL", label: "Bundesliga", badge: "BL" },
  { key: "CL", label: "Champions League", badge: "CL" },
];

const STANDING_LEAGUES = [
  { key: "PL", label: "Premier League", badge: "PL" },
  { key: "PD", label: "La Liga", badge: "LL" },
  { key: "SA", label: "Serie A", badge: "SA" },
  { key: "BL1", label: "Bundesliga", badge: "BL" },
  { key: "FL1", label: "Ligue 1", badge: "L1" },
];

const BASE = "http://127.0.0.1:8000/live";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isUpcoming(status: string) {
  return ["TIMED", "SCHEDULED", "POSTPONED"].includes(status);
}

function formatMatchTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// ─── League Table Carousel ────────────────────────────────────────────────────

function LeagueTableCarousel() {
  const [current, setCurrent] = React.useState(0);
  const [rows, setRows] = React.useState<StandingRow[]>([]);
  const [status, setStatus] = React.useState<"loading" | "error" | "ok">(
    "loading",
  );
  const cache = React.useRef<Record<string, StandingRow[]>>({});

  const load = React.useCallback(async (idx: number) => {
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

  React.useEffect(() => {
    load(current);
  }, [current, load]);

  const navigate = (dir: number) =>
    setCurrent(
      (c) => (c + dir + STANDING_LEAGUES.length) % STANDING_LEAGUES.length,
    );

  const league = STANDING_LEAGUES[current];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
            League Table
          </h2>
          <span className="text-[9px] font-bold text-primary-container px-2 py-0.5 bg-primary-container/10 border border-primary-container/20 rounded uppercase tracking-widest">
            {league.badge}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => navigate(-1)}
            className="w-7 h-7 rounded bg-surface-container-highest border border-[#474845]/20 text-on-surface-variant hover:border-primary-container/40 hover:text-primary-container transition-all flex items-center justify-center text-xs"
          >
            ←
          </button>
          <button
            onClick={() => navigate(1)}
            className="w-7 h-7 rounded bg-surface-container-highest border border-[#474845]/20 text-on-surface-variant hover:border-primary-container/40 hover:text-primary-container transition-all flex items-center justify-center text-xs"
          >
            →
          </button>
        </div>
      </div>
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
                  const isTop = pos <= 3;
                  const isRel = pos > total - 3;
                  return (
                    <tr
                      key={r.id}
                      className={`border-b border-[#474845]/5 ${isTop ? "bg-primary-container/5" : isRel ? "bg-error/5" : ""}`}
                    >
                      <td
                        className={`px-3 py-2 font-headline font-bold ${isTop ? "text-primary-container" : isRel ? "text-error" : "text-on-surface-variant"}`}
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
        <div className="flex justify-center gap-1.5 py-2 border-t border-[#474845]/10">
          {STANDING_LEAGUES.map((l, i) => (
            <button
              key={l.key}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-4 bg-primary-container" : "w-1 bg-[#474845]/40"}`}
            />
          ))}
        </div>
        <p className="text-center text-[9px] uppercase tracking-widest text-on-surface-variant pb-2">
          {league.label}
        </p>
      </div>
    </div>
  );
}

// ─── Fixtures Strip ───────────────────────────────────────────────────────────

function FixturesStrip() {
  const [allMatches, setAllMatches] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const targetStatuses = ["TIMED", "SCHEDULED", "POSTPONED"];
        const results = await Promise.allSettled(
          FIXTURE_LEAGUES.flatMap((lg) =>
            targetStatuses.map(async (status) => {
              const res = await fetch(
                `${BASE}/fixtures?limit=11&league=${lg.key}&status_filter=${status}`,
              );
              if (!res.ok) return [];
              const data: Match[] = await res.json();
              const now = new Date();
              return data
                .filter((m) => new Date(m.date) > now)
                .map((m) => ({ ...m, league: lg.key }));
            }),
          ),
        );
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
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setAllMatches(merged.slice(0, 11));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
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

  const leagueName = (key: string) =>
    FIXTURE_LEAGUES.find((l) => l.key === key)?.label ?? key;

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
                    {formatMatchTime(m.date)}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-on-surface-variant px-2 py-0.5 bg-surface-container-highest rounded uppercase">
                    Upcoming
                  </span>
                )}
                <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase">
                  {leagueName(m.league ?? "")}
                </span>
              </div>
              <Star className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-headline font-medium text-sm truncate pr-2">
                  {m.home_team}
                </span>
                <span className="font-headline font-bold text-lg">
                  {m.home_team_score !== null ? m.home_team_score : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface/60">
                <span className="font-headline font-medium text-sm truncate pr-2">
                  {m.away_team}
                </span>
                <span className="font-headline font-bold text-lg">
                  {m.away_team_score !== null ? m.away_team_score : "-"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Latest Results ───────────────────────────────────────────────────────────

function LatestResults() {
  const [results, setResults] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
                .filter((m) => new Date(m.date) <= now)
                .map((m) => ({ ...m, league: lg.key }));
            }),
          ),
        );
        const merged: Match[] = [];
        for (const r of fetched) {
          if (r.status === "fulfilled") merged.push(...r.value);
        }
        // Sort by most recent first
        merged.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setResults(merged.slice(0, 11));
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

  const leagueName = (key: string) =>
    FIXTURE_LEAGUES.find((l) => l.key === key)?.label ?? key;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {results.map((m) => {
        const homeWon =
          m.winner === "HOME_TEAM" ||
          (m.home_team_score !== null &&
            m.away_team_score !== null &&
            m.home_team_score > m.away_team_score);
        const awayWon =
          m.winner === "AWAY_TEAM" ||
          (m.home_team_score !== null &&
            m.away_team_score !== null &&
            m.away_team_score > m.home_team_score);
        const draw =
          m.winner === "DRAW" ||
          (m.home_team_score !== null &&
            m.away_team_score !== null &&
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
                  {formatShortDate(m.date)}
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
                  {m.home_team_score !== null ? m.home_team_score : "-"} –{" "}
                  {m.away_team_score !== null ? m.away_team_score : "-"}{" "}
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

// ─── Favorite Team Spotlight ──────────────────────────────────────────────────

function FavoriteTeamSpotlight() {
  const [favoriteTeam, setFavoriteTeam] = React.useState<Club | null>(null);
  const [recentForm, setRecentForm] = React.useState<string[]>([]);
  const [upcomingFixes, setUpcomingFixes] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const _res = await axiosClient.get("/teams/fav");
        const favTeams = _res.data;
        if (favTeams && favTeams.length > 0) {
          const team = favTeams[0];
          setFavoriteTeam(team);

          const fetchRecent = async (role: string) => {
            const res = await fetch(
              `${BASE}/fixtures?limit=5&status_filter=FINISHED&${role}=${team.name}`,
            );
            return res.ok ? await res.json() : [];
          };
          const homeRecent = await fetchRecent("home_team");
          const awayRecent = await fetchRecent("away_team");
          const allRecent = [...homeRecent, ...awayRecent]
            .sort(
              (a: Match, b: Match) =>
                new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, 5);

          const form = allRecent.map((m: Match) => {
            const isHome = m.home_team
              .toLowerCase()
              .includes(team.name.toLowerCase());
            const winTeam = m.winner;
            if (winTeam === "DRAW") return "D";
            if (winTeam === "HOME_TEAM" && isHome) return "W";
            if (winTeam === "AWAY_TEAM" && !isHome) return "W";
            return "L";
          });
          setRecentForm(form.reverse());

          const fetchUpcoming = async (role: string) => {
            const res1 = await fetch(
              `${BASE}/fixtures?limit=5&status_filter=SCHEDULED&${role}=${team.name}`,
            );
            const res2 = await fetch(
              `${BASE}/fixtures?limit=5&status_filter=TIMED&${role}=${team.name}`,
            );
            const d1 = res1.ok ? await res1.json() : [];
            const d2 = res2.ok ? await res2.json() : [];
            return [...d1, ...d2];
          };
          const homeUp = await fetchUpcoming("home_team");
          const awayUp = await fetchUpcoming("away_team");
          const allUp = [...homeUp, ...awayUp]
            .filter((m: Match) => new Date(m.date) > new Date())
            .sort(
              (a: Match, b: Match) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
            )
            .slice(0, 3);

          setUpcomingFixes(allUp);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-container-low rounded-lg h-64 animate-pulse border border-[#00fe66]/30"></div>
    );
  }

  if (!favoriteTeam) {
    return (
      <section className="bg-surface-container-low rounded-lg border border-[#474845]/30 p-6 text-center text-sm text-on-surface-variant">
        No favorite team selected.
      </section>
    );
  }

  return (
    <section className="bg-surface-container-low rounded-lg border border-[#00fe66]/30 overflow-hidden">
      <div className="p-6 bg-primary-container/5 border-b border-[#474845]/10">
        <div className="flex items-center justify-between mb-4">
          <span className="font-label text-[10px] uppercase tracking-widest text-primary-container">
            My Favorite Team
          </span>
          <Heart className="w-4 h-4 text-primary-container fill-primary-container" />
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h3 className="font-headline font-black text-2xl uppercase tracking-tighter">
              {favoriteTeam.name}
            </h3>
            <p className="text-on-surface-variant text-sm font-label uppercase">
              • {favoriteTeam.league_name || "League"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {recentForm.map((r, i) => (
            <span
              key={i}
              className={`w-8 h-8 rounded font-headline font-bold flex items-center justify-center text-xs ${
                r === "W"
                  ? "bg-primary-container text-on-primary"
                  : r === "L"
                    ? "bg-error text-on-error"
                    : "bg-surface-container-highest text-on-surface-variant border border-[#474845]/20"
              }`}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          Upcoming Fixtures
        </p>
        <div className="space-y-3">
          {upcomingFixes.length === 0 && (
            <p className="text-xs text-on-surface-variant">
              No upcoming matches.
            </p>
          )}
          {upcomingFixes.map((f) => {
            const isHome = f.home_team
              .toLowerCase()
              .includes(favoriteTeam.name.toLowerCase());
            const opp = isHome
              ? `vs ${f.away_team} (H)`
              : `vs ${f.home_team} (A)`;
            const d = new Date(f.date).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            });
            return (
              <div key={f.id} className="flex justify-between text-sm">
                <span className="text-on-surface-variant">{opp}</span>
                <span className="font-medium">{d}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary kinetic-grid min-h-screen">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .material-symbols-outlined { font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24; }
        .kinetic-grid {
            background-image: 
                linear-gradient(to right, rgba(71, 72, 69, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(71, 72, 69, 0.05) 1px, transparent 1px);
            background-size: 40px 40px;
        }
        .neon-glow:hover {
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.2);
            border-color: rgba(0, 255, 102, 0.4) !important;
        }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #242723; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00FF66; }
        .league-scroll::-webkit-scrollbar { width: 4px; }
        .league-scroll::-webkit-scrollbar-track { background: transparent; }
        .league-scroll::-webkit-scrollbar-thumb { background: #242723; border-radius: 10px; }
        .league-scroll::-webkit-scrollbar-thumb:hover { background: #00FF66; }
      `,
        }}
      />

      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 relative z-10">
        {/* SECTION 1: Live + Upcoming Fixtures */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-xl uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-container rounded-full animate-pulse"></span>
              Fixtures
            </h2>
          </div>
          <FixturesStrip />
        </section>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Latest Match Results — last 7 days, FINISHED */}
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Latest Results
              </h2>
              <LatestResults />
            </section>

            {/* Top Scorers */}
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Top Scorers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-low border border-[#00fe66]/20 p-6 rounded-lg relative overflow-hidden group">
                  <div className="relative z-10 space-y-4">
                    <span className="font-headline font-black text-6xl text-primary-container/20">
                      01
                    </span>
                    <div>
                      <h3 className="font-headline font-black text-2xl uppercase tracking-tight">
                        E. Haaland
                      </h3>
                      <p className="text-on-surface-variant text-sm">
                        Manchester City
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-headline font-black text-4xl text-primary-container">
                        12
                      </span>
                      <span className="font-label text-xs uppercase text-on-surface-variant mb-1">
                        Goals
                      </span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest">
                      <div className="h-full bg-primary-container shadow-[0_0_8px_rgba(0,255,102,0.6)] w-[85%]"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-low border border-[#474845]/20 p-6 rounded-lg relative group">
                  <div className="relative z-10 space-y-4">
                    <span className="font-headline font-black text-6xl text-on-surface-variant/20">
                      02
                    </span>
                    <div>
                      <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                        M. Salah
                      </h3>
                      <p className="text-on-surface-variant text-sm">
                        Liverpool FC
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-headline font-black text-4xl text-on-surface">
                        09
                      </span>
                      <span className="font-label text-xs uppercase text-on-surface-variant mb-1">
                        Goals
                      </span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest">
                      <div className="h-full bg-on-surface-variant w-[65%]"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-low border border-[#474845]/20 p-6 rounded-lg relative group">
                  <div className="relative z-10 space-y-4">
                    <span className="font-headline font-black text-6xl text-on-surface-variant/20">
                      03
                    </span>
                    <div>
                      <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                        Son H.M.
                      </h3>
                      <p className="text-on-surface-variant text-sm">
                        Tottenham
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-headline font-black text-4xl text-on-surface">
                        07
                      </span>
                      <span className="font-label text-xs uppercase text-on-surface-variant mb-1">
                        Goals
                      </span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest">
                      <div className="h-full bg-on-surface-variant w-[45%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Neural Predictions */}
            <section className="space-y-4">
              <h2 className="font-headline font-bold text-xl uppercase tracking-widest">
                Neural Predictions
              </h2>
              <div className="space-y-3">
                <div className="bg-surface-container-low p-6 rounded-lg border border-[#474845]/10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <span className="font-headline font-medium text-sm">
                        ARS
                      </span>
                      <span className="text-on-surface-variant text-xs font-label">
                        VS
                      </span>
                      <span className="font-headline font-medium text-sm">
                        MCI
                      </span>
                    </div>
                    <span className="text-primary-container font-headline font-black text-xl">
                      68%{" "}
                      <span className="text-[10px] font-label align-middle uppercase ml-1">
                        Win Prob
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 h-3 rounded-full overflow-hidden bg-surface-container-highest">
                    <div
                      className="bg-primary-container h-full shadow-[0_0_10px_rgba(0,255,102,0.4)]"
                      style={{ width: "68%" }}
                    ></div>
                    <div
                      className="bg-outline-variant h-full"
                      style={{ width: "12%" }}
                    ></div>
                    <div
                      className="bg-surface-bright h-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                    <span>Arsenal Win</span>
                    <span>Draw</span>
                    <span>Man City Win</span>
                  </div>
                </div>
                <div className="bg-surface-container-low p-6 rounded-lg border border-[#474845]/10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <span className="font-headline font-medium text-sm">
                        LIV
                      </span>
                      <span className="text-on-surface-variant text-xs font-label">
                        VS
                      </span>
                      <span className="font-headline font-medium text-sm">
                        CHE
                      </span>
                    </div>
                    <span className="text-primary-container font-headline font-black text-xl">
                      54%{" "}
                      <span className="text-[10px] font-label align-middle uppercase ml-1">
                        Win Prob
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 h-3 rounded-full overflow-hidden bg-surface-container-highest">
                    <div
                      className="bg-primary-container h-full shadow-[0_0_10px_rgba(0,255,102,0.4)]"
                      style={{ width: "54%" }}
                    ></div>
                    <div
                      className="bg-outline-variant h-full"
                      style={{ width: "26%" }}
                    ></div>
                    <div
                      className="bg-surface-bright h-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                    <span>Liverpool Win</span>
                    <span>Draw</span>
                    <span>Chelsea Win</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-8">
            {/* Favorite Team Spotlight */}
            <FavoriteTeamSpotlight />

            {/* League Table */}
            <section className="space-y-4">
              <LeagueTableCarousel />
            </section>

            {/* Favorite Player Card */}
            <section className="bg-surface-container-low p-6 rounded-lg border border-[#474845]/10 relative overflow-hidden">
              <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
                Player Focus
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <h4 className="font-headline font-black text-lg uppercase">
                    B. Saka
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Right Winger | ARS
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Passing Accuracy", pct: 89 },
                  { label: "Successful Dribbles", pct: 74 },
                ].map((s) => (
                  <div key={s.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                      <span>{s.label}</span>
                      <span className="text-primary-container">{s.pct}%</span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest">
                      <div
                        className="h-full bg-primary-container"
                        style={{ width: `${s.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[
                    { v: "05", l: "Goals" },
                    { v: "04", l: "Assists" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="bg-surface-container-highest p-3 rounded text-center"
                    >
                      <span className="block font-headline font-black text-xl">
                        {s.v}
                      </span>
                      <span className="text-[8px] uppercase text-on-surface-variant font-bold tracking-widest">
                        {s.l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* League Average */}
            <section className="bg-surface-container-low p-6 rounded-lg space-y-6">
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest border-b border-[#474845]/10 pb-4">
                League Average
              </h3>
              <div className="space-y-4">
                {[
                  { Icon: CircleDot, label: "Avg Goals / Game", value: "2.84" },
                  { Icon: ShieldCheck, label: "Clean Sheets", value: "22%" },
                  { Icon: Timer, label: "Effective Play", value: "56m" },
                ].map(({ Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-on-surface-variant" />
                      <span className="text-xs font-medium uppercase text-on-surface-variant">
                        {label}
                      </span>
                    </div>
                    <span className="font-headline font-bold text-primary-container">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-4 space-y-3">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">
                  Trending Now
                </p>
                <div className="flex flex-wrap gap-2">
                  {["#NorthLondonDerby", "#HaalandRecord", "#VARAnalysis"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-medium border border-[#474845]/10 cursor-pointer hover:border-[#00fe66]/40"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
