"use client";

import Image from "next/image";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  Suspense,
} from "react";
import {
  useInfinitePlayers,
  useGetFavoritePlayers,
  useAddFavoritePlayer,
  useRemoveFavoritePlayer,
  IPlayersPayload,
  IPlayersResponse,
} from "@/features/main/dashboard";
import { INPUT, LABEL, ALL_POSITIONS } from "@/lib/constants";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { calculateAge } from "@/lib/utils/footballUtils";
import { PlayerDetailModal } from "@/components/common/PlayerDetailModal";
import { Toast } from "@/components/common/Toast";
import { useSearchParams, useRouter } from "next/navigation";

// ── StatBadge ─────────────────────────────────────────────────────────────────

function StatBadge({ label, value }: { label: string; value?: number }) {
  const pct = value ?? 0;
  const color =
    pct >= 80
      ? "text-[#00ff66] border-[rgba(0,255,102,0.25)]"
      : pct >= 65
        ? "text-[#ffd700] border-[rgba(255,215,0,0.2)]"
        : "text-[rgba(255,80,80,0.85)] border-[rgba(255,80,80,0.2)]";

  return (
    <div
      className={`flex flex-col items-center justify-center border rounded-md px-1.5 py-1 min-w-[38px] ${color}`}
    >
      <span className="text-[14px] font-[Bebas_Neue,sans-serif] leading-none">
        {value ?? "—"}
      </span>
      <span className="text-[7px] font-bold tracking-[0.15em] uppercase mt-0.5 opacity-60">
        {label}
      </span>
    </div>
  );
}

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
      onClick={() => onCardClick(player)}
      className="
        relative bg-[rgba(18,20,17,0.92)] border border-[rgba(71,72,69,0.2)]
        hover:border-[rgba(0,255,102,0.3)] hover:bg-[rgba(0,255,102,0.03)]
        rounded-xl overflow-hidden transition-all duration-200 flex flex-col
        cursor-pointer group
      "
    >
      {/* Star button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStarClick(player);
        }}
        title={isFavorite ? "Remove from favourites" : "Add to favourites"}
        className={`
          absolute top-3 right-3 z-10
          w-7 h-7 flex items-center justify-center rounded-full
          border transition-all duration-200 text-[15px] leading-none
          ${
            isFavorite
              ? "text-[#ffd700] border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.08)] hover:bg-[rgba(255,80,80,0.1)] hover:border-[rgba(255,80,80,0.35)] hover:text-[rgba(255,80,80,0.9)]"
              : "text-[rgba(255,255,255,0.5)] border-[rgba(71,72,69,0.4)] bg-transparent hover:text-[#ffd700] hover:border-[rgba(255,215,0,0.35)] hover:bg-[rgba(255,215,0,0.06)]"
          }
        `}
      >
        {isFavorite ? "★" : "☆"}
      </button>

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
            {player.club_name || "Free Agent"} · {player.nationality_name} · Age{" "}
            {age}
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
          <StatBadge label="POS" value={player.goalkeeper_stats.positioning} />
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
  );
}

// ── Players Page ───────────────────────────────────────────────────────────────

const ALL_POSITIONS_WITH_GK = [...ALL_POSITIONS, "GK"];
const FEET = ["Left", "Right"];

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

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
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Debounce free-text / number inputs so backend only fires after user stops typing
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [observerTarget, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const playerIdParam = searchParams.get("playerId");
    if (playerIdParam) {
      const pid = parseInt(playerIdParam, 10);
      const playerFromFav = favPlayers.find((p) => p.id === pid);
      const playerFromList = players.find((p) => p.id === pid);
      const targetPlayer = playerFromFav || playerFromList;

      if (targetPlayer && selectedPlayer?.id !== targetPlayer.id) {
        // Wrap in setTimeout to avoid synchronous setState warning
        const timer = setTimeout(() => {
          setSelectedPlayer(targetPlayer);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, favPlayers, players, selectedPlayer?.id]);

  const addFav = useAddFavoritePlayer();
  const removeFav = useRemoveFavoritePlayer();

  const showToast = useCallback((message: string, type: ToastState["type"]) => {
    setToast({ message, type });
  }, []);

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
          showToast(`${player.short_name} added to favourites`, "info"),
        onError: () => showToast("Failed to update favourites", "error"),
      });
    }
  }

  function handleModalFavToggle() {
    if (!selectedPlayer) return;
    handleStarClick(selectedPlayer);
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
      {/* ── Page Header ── */}
      <div className="border-b border-[rgba(71,72,69,0.2)] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-[Bebas_Neue,sans-serif] text-[28px] tracking-[0.06em] text-[#fcfcf8]">
            Players Database
          </h1>
          {isFetching && (
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2.5 py-1 rounded-[4px] animate-pulse">
              Updating…
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-0 max-w-[1600px] mx-auto">
        {/* ── Filters sidebar ── */}
        <div className="lg:hidden px-5 py-3 border-b border-[rgba(71,72,69,0.2)]">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="w-full flex items-center justify-between py-2 px-4 rounded-lg bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] text-[12px] font-bold tracking-[0.1em] uppercase"
          >
            <span>{isFiltersOpen ? "Hide Filters" : "Show Filters"}</span>
            <span className="text-[10px] opacity-60">
              {isFiltersOpen ? "▲" : "▼"}
            </span>
          </button>
        </div>

        <aside
          className={`${isFiltersOpen ? "block" : "hidden"} lg:block lg:w-[280px] shrink-0 border-b lg:border-b-0 lg:border-r border-[rgba(71,72,69,0.2)] p-5 animate-in fade-in slide-in-from-top-2 duration-300 lg:animate-none`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-[Bebas_Neue,sans-serif] text-[16px] tracking-[0.08em] text-[rgba(255,255,255,0.5)]">
              Filters
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[9px] font-bold tracking-[0.15em] uppercase text-[rgba(255,100,100,0.7)] hover:text-[rgba(255,100,100,1)] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Player Name</span>
              <input
                className={INPUT}
                placeholder="Search by name…"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Nationality */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Nationality</span>
              <input
                className={INPUT}
                placeholder="e.g. Brazil, England"
                value={nationalityName}
                onChange={(e) => setNationalityName(e.target.value)}
              />
            </div>

            {/* Position */}
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

            {/* Preferred Foot */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Preferred Foot</span>
              <select
                className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-[10px] py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-[border-color] duration-200 appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)]"
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value)}
              >
                <option value="">Any</option>
                {FEET.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Overall Rating */}
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

            {/* Age */}
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
          </div>
        </aside>

        {/* ── Players Grid ── */}
        <main className="flex-1 p-5">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[rgba(18,20,17,0.6)] rounded-xl h-[138px] animate-pulse border border-[rgba(71,72,69,0.1)]"
                />
              ))}
            </div>
          ) : players.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <div className="w-14 h-14 rounded-full border border-[rgba(71,72,69,0.3)] flex items-center justify-center text-2xl mb-2">
                🔍
              </div>
              <p className="font-[Bebas_Neue,sans-serif] text-[22px] tracking-[0.06em] text-[rgba(255,255,255,0.3)]">
                No Players Found
              </p>
              <p className="text-[11px] text-[rgba(255,255,255,0.2)] tracking-[0.08em] max-w-xs">
                Try adjusting your filters to find players.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-3 py-1.5 rounded-[4px] hover:bg-[rgba(0,255,102,0.12)] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isFavorite={favIds.has(player.id)}
                    onStarClick={handleStarClick}
                    onCardClick={setSelectedPlayer}
                  />
                ))}
              </div>
              {(hasNextPage || isFetchingNextPage) && (
                <div
                  ref={observerTarget}
                  className="h-20 w-full mt-4 flex items-center justify-center"
                >
                  <div className="w-6 h-6 border-2 border-[#00ff66] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Player Detail Modal ── */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          isFavorite={favIds.has(selectedPlayer.id)}
          favLoading={addFav.isPending || removeFav.isPending}
          onClose={() => {
            setSelectedPlayer(null);
            if (searchParams.has("playerId")) {
              router.replace("/Players");
            }
          }}
          onToggleFavorite={handleModalFavToggle}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
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
