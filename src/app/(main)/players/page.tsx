"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, Heart, X, ChevronDown } from "lucide-react";
import {
  useGetPlayers,
  useGetFavoritePlayers,
  useToggleFavoritePlayer,
} from "@/features/main/dashboard";
import type { IPlayersResponse } from "@/features/main/dashboard";
import type { Player } from "@/types/football";
import { COUNTRIES, LEAGUES_WITH_ACCENT } from "@/lib/constants";
import { PlayerStatsModal } from "@/components/ui/players/PlayerStatsModal";

/* ── league → teams mapping ── */
const LEAGUE_TEAMS: Record<string, string[]> = {
  PL: [
    "Arsenal",
    "Aston Villa",
    "Chelsea",
    "Everton",
    "Liverpool",
    "Manchester City",
    "Manchester United",
    "Newcastle United",
    "Tottenham Hotspur",
    "West Ham United",
    "Brighton & Hove Albion",
    "Fulham",
    "Wolverhampton Wanderers",
    "Crystal Palace",
    "Bournemouth",
    "Brentford",
    "Nottingham Forest",
  ],
  PD: [
    "Real Madrid",
    "FC Barcelona",
    "Atlético Madrid",
    "Real Sociedad",
    "Real Betis",
    "Villarreal",
    "Athletic Club",
    "Sevilla FC",
    "Valencia CF",
    "Girona FC",
  ],
  SA: [
    "Inter Milan",
    "AC Milan",
    "Juventus",
    "SSC Napoli",
    "AS Roma",
    "SS Lazio",
    "Atalanta",
    "ACF Fiorentina",
    "Bologna FC 1909",
    "Torino FC",
  ],
  BL1: [
    "FC Bayern München",
    "Borussia Dortmund",
    "RB Leipzig",
    "Bayer 04 Leverkusen",
    "VfB Stuttgart",
    "Eintracht Frankfurt",
    "VfL Wolfsburg",
    "Borussia Mönchengladbach",
  ],
  FL1: [
    "Paris Saint-Germain",
    "Olympique de Marseille",
    "AS Monaco",
    "Olympique Lyonnais",
    "LOSC Lille",
    "OGC Nice",
    "Stade Rennais FC 1901",
  ],
  PPL: ["SL Benfica", "FC Porto", "Sporting CP", "SC Braga", "Vitória SC"],
};

const POSITION_GROUPS = [
  { label: "Attack", positions: ["ST", "CF", "LW", "RW", "LF", "RF"] },
  { label: "Midfield", positions: ["CM", "CAM", "CDM", "LM", "RM"] },
  { label: "Defense", positions: ["CB", "LB", "RB", "LWB", "RWB"] },
  { label: "Goalkeeper", positions: ["GK"] },
];

const PAGE_SIZE = 50;

export default function PlayersPage() {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("");
  const [nationality, setNationality] = useState("");
  const [league, setLeague] = useState("");
  const [team, setTeam] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayersResponse | null>(
    null,
  );

  /* ── Infinite scroll state ── */
  const [allPlayers, setAllPlayers] = useState<IPlayersResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Initial load
  const { data: players = [], isLoading } = useGetPlayers({
    limit: PAGE_SIZE,
    offset: 0,
    name: search || undefined,
    position: position || undefined,
    nationalityName: nationality || undefined,
  });

  // Reset accumulated players when filters/search change
  useEffect(() => {
    setAllPlayers(players);
    setHasMore(players.length >= PAGE_SIZE);
  }, [players]);

  /* Load more function */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const { getPlayers } =
        await import("@/features/main/dashboard/apis/getPlayers");
      const nextOffset = allPlayers.length;
      const more = await getPlayers({
        limit: PAGE_SIZE,
        offset: nextOffset,
        name: search || undefined,
        position: position || undefined,
        nationalityName: nationality || undefined,
      });

      if (more.length < PAGE_SIZE) setHasMore(false);

      if (more.length > 0) {
        setAllPlayers((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const unique = more.filter((p) => !existingIds.has(p.id));
          return [...prev, ...unique];
        });
      }
    } catch (error) {
      console.error("Failed to load more players:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, allPlayers.length, search, position, nationality]);

  /* Intersection observer for infinite scroll */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" },
    );

    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [loadMore]);

  const { data: favPlayers = [] } = useGetFavoritePlayers();
  const { mutate: toggleFav } = useToggleFavoritePlayer();

  const favIds = useMemo(
    () => new Set(favPlayers.map((p: Player) => p.id)),
    [favPlayers],
  );

  const filteredPlayers = useMemo(() => {
    let list = allPlayers;

    // Client-side filtering for League/Team if desired,
    // though backend filtering for everything is better for performance.
    // The current backend getPlayers doesn't support league/team_name directly yet,
    // only teamId. We'll use the club_name filter for now as implemented before.
    if (league) {
      const leagueTeams = LEAGUE_TEAMS[league] ?? [];
      if (leagueTeams.length > 0) {
        list = list.filter((p) =>
          leagueTeams.some((t) =>
            p.club_name.toLowerCase().includes(t.toLowerCase()),
          ),
        );
      }
    }
    if (team) {
      list = list.filter((p) =>
        p.club_name.toLowerCase().includes(team.toLowerCase()),
      );
    }
    return list;
  }, [allPlayers, league, team]);

  /* Sort: favourites pinned to top */
  const sortedPlayers = useMemo(() => {
    const favs = filteredPlayers.filter((p) => favIds.has(p.id));
    const rest = filteredPlayers.filter((p) => !favIds.has(p.id));
    return [...favs, ...rest];
  }, [filteredPlayers, favIds]);

  const teamsForLeague = league ? (LEAGUE_TEAMS[league] ?? []) : [];

  const handleToggleFav = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      toggleFav(id);
    },
    [toggleFav],
  );

  const clearFilters = () => {
    setPosition("");
    setNationality("");
    setLeague("");
    setTeam("");
    setSearch("");
  };

  const hasActiveFilters = position || nationality || league || team || search;

  return (
    <>
      <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary kinetic-grid min-h-screen">
        <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-6 relative z-10">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-on-surface">
              Pla<span className="text-primary-container">y</span>ers
            </h1>
            <p className="text-xs text-on-surface-variant tracking-widest uppercase font-label">
              Browse · Search · Favourite
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                <input
                  id="player-search"
                  type="text"
                  placeholder="Search players by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-all duration-200 focus:border-primary-container/50 focus:shadow-[0_0_16px_rgba(0,254,102,0.08)] font-body"
                />
              </div>
              <button
                id="toggle-filters"
                onClick={() => setFiltersOpen((p) => !p)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                  filtersOpen || hasActiveFilters
                    ? "bg-primary-container/10 border-primary-container/30 text-primary-container"
                    : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-primary-container/30 hover:text-primary-container"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(position || nationality || league || team) && (
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                )}
              </button>
            </div>

            {/* Filter Dropdowns */}
            {filtersOpen && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/15 animate-[fadeUp_0.25s_ease]">
                {/* Position */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/60 font-label">
                    Position
                  </label>
                  <div className="relative">
                    <select
                      id="filter-position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full appearance-none bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-xs text-on-surface outline-none cursor-pointer transition-colors focus:border-primary-container/40"
                    >
                      <option value="">All Positions</option>
                      {POSITION_GROUPS.map((g) => (
                        <optgroup key={g.label} label={g.label}>
                          {g.positions.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                {/* Nationality */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/60 font-label">
                    Nationality
                  </label>
                  <div className="relative">
                    <select
                      id="filter-nationality"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full appearance-none bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-xs text-on-surface outline-none cursor-pointer transition-colors focus:border-primary-container/40"
                    >
                      <option value="">All Nationalities</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                {/* League */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/60 font-label">
                    League
                  </label>
                  <div className="relative">
                    <select
                      id="filter-league"
                      value={league}
                      onChange={(e) => {
                        setLeague(e.target.value);
                        setTeam("");
                      }}
                      className="w-full appearance-none bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-xs text-on-surface outline-none cursor-pointer transition-colors focus:border-primary-container/40"
                    >
                      <option value="">All Leagues</option>
                      {LEAGUES_WITH_ACCENT.map((l) => (
                        <option key={l.key} value={l.key}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                {/* Team */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/60 font-label">
                    Team
                  </label>
                  <div className="relative">
                    <select
                      id="filter-team"
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      disabled={!league}
                      className="w-full appearance-none bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-xs text-on-surface outline-none cursor-pointer transition-colors focus:border-primary-container/40 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {league ? "All Teams" : "Select a league first"}
                      </option>
                      {teamsForLeague.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="col-span-2 md:col-span-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-primary-container/70 hover:text-primary-container transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-on-surface-variant font-label">
              {isLoading
                ? "Searching..."
                : `${sortedPlayers.length} players loaded${hasMore ? " · Scroll for more" : ""}`}
            </p>
            {favIds.size > 0 && (
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary-container/60 font-label flex items-center gap-1.5">
                <Heart className="w-3 h-3 fill-current" />
                {favIds.size} favourited
              </p>
            )}
          </div>

          {/* Player Grid */}
          {isLoading && allPlayers.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-surface-container-low border border-outline-variant/10 animate-pulse"
                />
              ))}
            </div>
          ) : sortedPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Search className="w-10 h-10 text-on-surface-variant/20" />
              <p className="text-sm text-on-surface-variant/50 font-label">
                No players found — try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sortedPlayers.map((player) => {
                const isFav = favIds.has(player.id);
                return (
                  <div
                    key={player.id}
                    id={`player-card-${player.id}`}
                    onClick={() => setSelectedPlayer(player)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,254,102,0.08)]"
                  >
                    {/* Card BG */}
                    <div className="absolute inset-0 bg-surface-container-low border border-outline-variant/10 rounded-2xl group-hover:border-primary-container/25 transition-colors duration-300" />

                    {/* Favourite */}
                    <button
                      id={`fav-btn-${player.id}`}
                      onClick={(e) => handleToggleFav(e, player.id)}
                      className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isFav
                          ? "bg-primary-container/15 text-primary-container scale-110"
                          : "bg-surface-container-highest/60 text-on-surface-variant/40 opacity-0 group-hover:opacity-100 hover:text-primary-container hover:bg-primary-container/10"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`}
                      />
                    </button>

                    {/* Fav badge */}
                    {isFav && (
                      <div className="absolute top-3 left-3 z-20">
                        <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-primary-container bg-primary-container/10 border border-primary-container/20 px-1.5 py-0.5 rounded-full">
                          ★ FAV
                        </span>
                      </div>
                    )}

                    {/* Player Image */}
                    <div className="relative z-10 pt-6 pb-2 flex justify-center">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-outline-variant/15 group-hover:border-primary-container/30 transition-colors duration-300 bg-surface-container-highest">
                        {player.player_face_url ? (
                          <img
                            src={player.player_face_url}
                            alt={player.short_name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-3xl text-on-surface-variant/20 font-display">
                              {player.short_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Player Name */}
                    <div className="relative z-10 px-3 pb-4 text-center">
                      <h3 className="font-headline font-bold text-sm text-on-surface truncate leading-tight">
                        {player.short_name}
                      </h3>
                      <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5 truncate">
                        {player.club_name}
                      </p>
                    </div>

                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary-container/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {hasMore && !isLoading && (
            <div ref={sentinelRef} className="flex justify-center py-10">
              {loadingMore && (
                <div className="flex items-center gap-2">
                  {[0, 150, 300].map((delay) => (
                    <div
                      key={delay}
                      className="w-2.5 h-2.5 rounded-full bg-primary-container animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Stats Modal */}
      {selectedPlayer && (
        <PlayerStatsModal
          player={selectedPlayer}
          isFav={favIds.has(selectedPlayer.id)}
          onToggleFav={() => toggleFav(selectedPlayer.id)}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </>
  );
}
