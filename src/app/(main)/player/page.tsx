"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import {
  useInfinitePlayers,
  useGetFavoritePlayers,
  useAddFavoritePlayer,
  useRemoveFavoritePlayer,
  IPlayersPayload,
  IPlayersResponse,
} from "@/features/main/dashboard";
import {
  INPUT,
  LABEL,
  ALL_POSITIONS_WITH_GK,
  PREFERRED_FEET,
} from "@/lib/constants";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import { useToast } from "@/lib/hooks/useToast";
import { PlayerDetailModal } from "@/components/common/modals/PlayerDetailModal";
import { Toast } from "@/components/common/Toast";
import { FilterSidebar } from "@/components/common/FilterSidebar";
import { PlayerCard } from "@/components/ui/player/PlayerCard";
import { DatabaseGrid } from "@/components/common/DatabaseGrid";
import { PageHeader } from "@/components/common/PageHeader";
import { useSearchParams, useRouter } from "next/navigation";

function PlayersPageContent() {
  const [name, setName] = useState("");
  const [nationalityName, setNationalityName] = useState("");
  const [position, setPosition] = useState("");
  const [preferredFoot, setPreferredFoot] = useState("");
  const [minOverall, setMinOverall] = useState<number | undefined>();
  const [maxOverall, setMaxOverall] = useState<number | undefined>();
  const [minAge, setMinAge] = useState<number | undefined>();
  const [maxAge, setMaxAge] = useState<number | undefined>();

  const [selectedPlayer, setSelectedPlayer] = useState<IPlayersResponse | null>(
    null,
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { toast, showToast, dismissToast } = useToast();

  const searchParams = useSearchParams();
  const router = useRouter();

  const dName = useDebounce(name, 500);
  const dNationality = useDebounce(nationalityName, 500);
  const dMinOverall = useDebounce(minOverall, 500);
  const dMaxOverall = useDebounce(maxOverall, 500);
  const dMinAge = useDebounce(minAge, 500);
  const dMaxAge = useDebounce(maxAge, 500);

  const payload: IPlayersPayload = {
    limit: 50,
    name: dName || undefined,
    nationalityName: dNationality || undefined,
    position: position || undefined,
    preferredFoot: preferredFoot || undefined,
    minOverall: dMinOverall,
    maxOverall: dMaxOverall,
    minAge: dMinAge,
    maxAge: dMaxAge,
  };

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePlayers(payload);

  const players = useMemo(() => data?.pages.flat() || [], [data?.pages]);
  const { data: favPlayers = [] } = useGetFavoritePlayers();
  const favIds = useMemo(
    () => new Set(favPlayers.map((p) => p.id)),
    [favPlayers],
  );

  const observerRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  useEffect(() => {
    const playerIdParam = searchParams.get("playerId");
    if (playerIdParam) {
      const pid = parseInt(playerIdParam, 10);
      const targetPlayer =
        favPlayers.find((p) => p.id === pid) ||
        players.find((p) => p.id === pid);

      if (targetPlayer && selectedPlayer?.id !== targetPlayer.id) {
        const timer = setTimeout(() => setSelectedPlayer(targetPlayer), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, favPlayers, players, selectedPlayer?.id]);

  const addFav = useAddFavoritePlayer();
  const removeFav = useRemoveFavoritePlayer();

  function handleStarClick(player: IPlayersResponse) {
    const isFav = favIds.has(player.id);
    if (isFav) {
      removeFav.mutate(player.id, {
        onSuccess: () =>
          showToast(`${player.short_name} removed from favourites`, "info"),
        onError: () => showToast("Failed to update favourites", "error"),
      });
    } else {
      addFav.mutate(player.id, {
        onSuccess: () =>
          showToast(`${player.short_name} added to favourites`, "success"),
        onError: () => showToast("Failed to update favourites", "error"),
      });
    }
  }

  const hasActiveFilters =
    !!name ||
    !!nationalityName ||
    !!position ||
    !!preferredFoot ||
    minOverall !== undefined ||
    maxOverall !== undefined ||
    minAge !== undefined ||
    maxAge !== undefined;

  function clearFilters() {
    setName("");
    setNationalityName("");
    setPosition("");
    setPreferredFoot("");
    setMinOverall(undefined);
    setMaxOverall(undefined);
    setMinAge(undefined);
    setMaxAge(undefined);
  }

  return (
    <div className="min-h-screen bg-[#0a0b09] text-[#fcfcf8] font-[Oxanium,sans-serif]">
      <PageHeader title="Players Database" isFetching={isFetching} />

      <div className="flex flex-col lg:flex-row gap-0 max-w-[1600px] mx-auto">
        <FilterSidebar
          isOpen={isFiltersOpen}
          onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        >
          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Player Name</span>
            <input
              className={INPUT}
              placeholder="Search by name…"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Nationality</span>
            <input
              className={INPUT}
              placeholder="e.g. Brazil, England"
              value={nationalityName}
              onChange={(e) => setNationalityName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Position</span>
            <select
              className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-[10px] py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-[border-color] duration-200 appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)]"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="">All Positions</option>
              {ALL_POSITIONS_WITH_GK.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Preferred Foot</span>
            <select
              className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-[10px] py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-[border-color] duration-200 appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)]"
              value={preferredFoot}
              onChange={(e) => setPreferredFoot(e.target.value)}
            >
              <option value="">Any</option>
              {PREFERRED_FEET.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Overall Rating</span>
            <div className="flex gap-1.5 items-center">
              <input
                className={INPUT}
                type="number"
                placeholder="Min"
                min={1}
                max={99}
                value={minOverall ?? ""}
                onChange={(e) =>
                  setMinOverall(e.target.value ? +e.target.value : undefined)
                }
              />
              <span className="text-[rgba(255,255,255,0.2)] text-[11px] shrink-0">
                –
              </span>
              <input
                className={INPUT}
                type="number"
                placeholder="Max"
                min={1}
                max={99}
                value={maxOverall ?? ""}
                onChange={(e) =>
                  setMaxOverall(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Age</span>
            <div className="flex gap-1.5 items-center">
              <input
                className={INPUT}
                type="number"
                placeholder="Min"
                min={15}
                max={50}
                value={minAge ?? ""}
                onChange={(e) =>
                  setMinAge(e.target.value ? +e.target.value : undefined)
                }
              />
              <span className="text-[rgba(255,255,255,0.2)] text-[11px] shrink-0">
                –
              </span>
              <input
                className={INPUT}
                type="number"
                placeholder="Max"
                min={15}
                max={50}
                value={maxAge ?? ""}
                onChange={(e) =>
                  setMaxAge(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
          </div>
        </FilterSidebar>

        <main className="flex-1 p-5">
          <DatabaseGrid
            isLoading={isLoading}
            isEmpty={players.length === 0}
            emptyLabel="No Players Found"
            emptySubtext="Try adjusting your filters to find players."
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            observerRef={observerRef}
          >
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isFavorite={favIds.has(player.id)}
                onStarClick={handleStarClick}
                onCardClick={setSelectedPlayer}
              />
            ))}
          </DatabaseGrid>
        </main>
      </div>

      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          isFavorite={favIds.has(selectedPlayer.id)}
          favLoading={addFav.isPending || removeFav.isPending}
          onClose={() => {
            setSelectedPlayer(null);
            if (searchParams.has("playerId")) {
              router.replace("/player");
            }
          }}
          onToggleFavorite={() => handleStarClick(selectedPlayer)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={dismissToast}
        />
      )}
    </div>
  );
}

export default function PlayersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0b09] flex items-center justify-center text-[#00ff66] font-[Bebas_Neue]">
          Loading...
        </div>
      }
    >
      <PlayersPageContent />
    </Suspense>
  );
}
