"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useMemo, Suspense } from "react";
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
import { calculateAge } from "@/lib/utils/footballUtils";
import { PlayerDetailModal } from "@/components/common/PlayerDetailModal";
import { Toast } from "@/components/common/Toast";
import { StatBadge } from "@/components/common/StatBadge";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { FilterSidebar } from "@/components/common/FilterSidebar";
import { DatabaseGrid } from "@/components/common/DatabaseGrid";
import { PageHeader } from "@/components/common/PageHeader";
import { useSearchParams, useRouter } from "next/navigation";

// ── PlayerCard ────────────────────────────────────────────────────────────────

interface PlayerCardProps {
  player: IPlayersResponse;
  isFavorite: boolean;
  onStarClick: (player: IPlayersResponse) => void;
  onCardClick: (player: IPlayersResponse) => void;
}

function PlayerCard({
  player,
  isFavorite,
  onStarClick,
  onCardClick,
}: PlayerCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const age = calculateAge(player.dob);

  return (
    <div
      className="
        relative bg-[rgba(18,20,17,0.92)] border border-[rgba(71,72,69,0.2)]
        hover:border-[rgba(0,255,102,0.3)] hover:bg-[rgba(0,255,102,0.03)]
        rounded-xl overflow-hidden transition-all duration-200 flex flex-col
        group
      "
    >
      {/* Button is a sibling to the clickable content — no stopPropagation needed */}
      <FavoriteButton
        isFavorite={isFavorite}
        onClick={() => onStarClick(player)}
      />
      <div
        onClick={() => onCardClick(player)}
        className="flex flex-col cursor-pointer"
      >
        {/* Top: avatar + identity */}
        <div className="flex items-center gap-3 p-4 border-b border-[rgba(71,72,69,0.12)] pr-14">
          <div className="w-[52px] h-[52px] rounded-lg overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center">
            {player.player_face_url && !imgErr ? (
              <Image
                src={player.player_face_url}
                alt={player.short_name}
                width={52}
                height={52}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                unoptimized
                onError={() => setImgErr(true)}
              />
            ) : (
              <span className="text-[rgba(0,255,102,0.3)] text-2xl">👤</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-[Bebas_Neue,sans-serif] text-[20px] text-[#fcfcf8] leading-none truncate">
                {player.short_name}
              </span>
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2 py-0.5 rounded-[4px]">
                {player.positions?.join(" · ") ?? "—"}
              </span>
            </div>
            <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1 tracking-[0.05em] truncate">
              {player.club_name || "Free Agent"} · {player.nationality_name} ·
              Age {age}
            </div>
            <div className="text-[10px] text-[rgba(255,255,255,0.25)] mt-0.5 tracking-[0.05em]">
              {player.preferred_foot} foot · {player.work_rate}
            </div>
          </div>

          <div className="font-[Bebas_Neue,sans-serif] text-[38px] text-[#00ff66] leading-none shrink-0">
            {player.overall}
          </div>
        </div>

        {/* Bottom: stats */}
        {player.goalkeeper_stats ? (
          <div className="flex gap-1.5 flex-wrap px-4 py-3 justify-between">
            <StatBadge label="DIV" value={player.goalkeeper_stats.diving} />
            <StatBadge label="HAN" value={player.goalkeeper_stats.handling} />
            <StatBadge label="KIC" value={player.goalkeeper_stats.kicking} />
            <StatBadge
              label="POS"
              value={player.goalkeeper_stats.positioning}
            />
            <StatBadge label="REF" value={player.goalkeeper_stats.reflexes} />
            <StatBadge label="SPD" value={player.goalkeeper_stats.speed} />
          </div>
        ) : (
          <div className="flex gap-1.5 flex-wrap px-4 py-3 justify-between">
            <StatBadge label="PAC" value={player.player_stats?.pace} />
            <StatBadge label="SHO" value={player.player_stats?.shooting} />
            <StatBadge label="PAS" value={player.player_stats?.passing} />
            <StatBadge label="DRI" value={player.player_stats?.dribbling} />
            <StatBadge label="DEF" value={player.player_stats?.defending} />
            <StatBadge label="PHY" value={player.player_stats?.physic} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Players Page ───────────────────────────────────────────────────────────────

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
          showToast(`${player.short_name} removed from favourites`, "error"),
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
