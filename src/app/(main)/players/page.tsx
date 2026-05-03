"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal, Heart } from "lucide-react";
import {
  useGetFavoritePlayers,
  useToggleFavoritePlayer,
  useInfinitePlayers,
} from "@/features/main/dashboard";
import type { IPlayersResponse } from "@/features/main/dashboard";
import { LEAGUE_TEAMS } from "@/lib/constants";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import { PlayerBrowserCard } from "@/components/ui/players/PlayerBrowserCard";
import { PlayersFilter } from "@/components/ui/players/PlayersFilter";
import type { PlayersFilterValues } from "@/components/ui/players/PlayersFilter";
import { PlayerStatsModal } from "@/components/ui/players/PlayerStatsModal";

const DEFAULT_FILTERS: PlayersFilterValues = {
  search: "",
  position: "",
  nationality: "",
  league: "",
  team: "",
};

export default function PlayersPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<PlayersFilterValues>(DEFAULT_FILTERS);
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayersResponse | null>(
    null,
  );

  const { search, position, nationality, league, team } = filters;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfinitePlayers({
      name: search || undefined,
      position: position || undefined,
      nationalityName: nationality || undefined,
    });

  const sentinelRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const allPlayers = useMemo(() => data?.pages.flat() ?? [], [data]);

  const { data: favPlayers = [] } = useGetFavoritePlayers();
  const { mutate: toggleFav } = useToggleFavoritePlayer();
  const favIds = useMemo(
    () => new Set(favPlayers.map((p) => p.id)),
    [favPlayers],
  );

  // League/team are client-side only — backend doesn't filter by league directly
  const visiblePlayers = useMemo(() => {
    let list = allPlayers;
    if (league) {
      const leagueTeams = LEAGUE_TEAMS[league] ?? [];
      if (leagueTeams.length > 0) {
        list = list.filter((p) =>
          leagueTeams.some((t) =>
            (p.club_name ?? "").toLowerCase().includes(t.toLowerCase()),
          ),
        );
      }
    }
    if (team) {
      list = list.filter((p) =>
        (p.club_name ?? "").toLowerCase().includes(team.toLowerCase()),
      );
    }
    // Pin favourites to top
    const favs = list.filter((p) => favIds.has(p.id));
    const rest = list.filter((p) => !favIds.has(p.id));
    return [...favs, ...rest];
  }, [allPlayers, league, team, favIds]);

  const handleFilterChange = useCallback(
    (partial: Partial<PlayersFilterValues>) =>
      setFilters((prev) => ({ ...prev, ...partial })),
    [],
  );

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const hasActiveFilters = search || position || nationality || league || team;

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

          {/* Search & filter bar */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search players by name..."
                  value={search}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-all duration-200 focus:border-primary-container/50 focus:shadow-[0_0_16px_rgba(0,254,102,0.08)] font-body"
                />
              </div>
              <button
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

            {filtersOpen && (
              <PlayersFilter
                values={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
              />
            )}
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-on-surface-variant font-label">
              {isLoading
                ? "Searching..."
                : `${visiblePlayers.length} players loaded${hasNextPage ? " · Scroll for more" : ""}`}
            </p>
            {favIds.size > 0 && (
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary-container/60 font-label flex items-center gap-1.5">
                <Heart className="w-3 h-3 fill-current" />
                {favIds.size} favourited
              </p>
            )}
          </div>

          {/* Player grid */}
          {isLoading && allPlayers.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-surface-container-low border border-outline-variant/10 animate-pulse"
                />
              ))}
            </div>
          ) : visiblePlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Search className="w-10 h-10 text-on-surface-variant/20" />
              <p className="text-sm text-on-surface-variant/50 font-label">
                No players found — try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {visiblePlayers.map((player) => (
                <PlayerBrowserCard
                  key={player.id}
                  player={player}
                  isFav={favIds.has(player.id)}
                  onToggleFav={(e) => {
                    e.stopPropagation();
                    toggleFav(player.id);
                  }}
                  onClick={() => setSelectedPlayer(player)}
                />
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="flex justify-center py-10">
            {isFetchingNextPage && (
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
        </main>
      </div>

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
