"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  Suspense,
  useCallback,
} from "react";
import Image from "next/image";
import {
  useInfiniteTeams,
  ITeamsResponse,
  ITeamsPayload,
  useGetFavoriteTeam,
  useAddFavoriteTeam,
  useRemoveFavoriteTeam,
} from "@/features/main/dashboard";
import { INPUT, LABEL } from "@/lib/constants";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Toast } from "@/components/common/Toast";

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

// ── TeamCard ──────────────────────────────────────────────────────────────────

interface TeamCardProps {
  team: ITeamsResponse;
  isFavorite: boolean;
  onStarClick: (team: ITeamsResponse) => void;
}

function TeamCard({ team, isFavorite, onStarClick }: TeamCardProps) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
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
          onStarClick(team);
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

      {/* Top: Logo + Identity */}
      <div className="flex items-center gap-3 p-4 border-b border-[rgba(71,72,69,0.12)] pr-12">
        <div className="w-[52px] h-[52px] rounded-lg overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center p-1">
          {team.logo_url && !imgErr ? (
            <Image
              src={team.logo_url}
              alt={team.name}
              width={52}
              height={52}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              unoptimized
              onError={() => setImgErr(true)}
            />
          ) : (
            <span className="text-[rgba(0,255,102,0.3)] text-2xl">🛡️</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-[Bebas_Neue,sans-serif] text-[20px] text-[#fcfcf8] leading-none truncate">
              {team.name}
            </span>
          </div>
          <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1 tracking-[0.05em] truncate">
            {team.league_name !== "Friendly International"
              ? team.league_name
              : "National Team"}{" "}
            · {team.nationality_name}
          </div>
          <div className="text-[10px] text-[rgba(255,255,255,0.25)] mt-0.5 tracking-[0.05em] truncate">
            🏟️ {team.home_stadium || "National Stadium"}
          </div>
        </div>

        <div className="font-[Bebas_Neue,sans-serif] text-[38px] text-[#00ff66] leading-none shrink-0">
          {team.overall}
        </div>
      </div>

      {/* Bottom: stats */}
      <div className="flex gap-2 px-4 py-3 justify-around">
        <StatBadge label="ATT" value={team.attack} />
        <StatBadge label="MID" value={team.midfield} />
        <StatBadge label="DEF" value={team.defence} />
      </div>
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  currentFav: string;
  newFav: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  currentFav,
  newFav,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121411] border border-[rgba(71,72,69,0.3)] p-6 rounded-2xl max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="font-[Bebas_Neue] text-2xl text-[#fcfcf8] tracking-wider mb-2">
          Change Favorite Team?
        </h3>
        <p className="text-[12px] text-[rgba(255,255,255,0.6)] leading-relaxed mb-6">
          You already have{" "}
          <span className="text-[#00ff66] font-bold">{currentFav}</span> as your
          favorite. Do you want to remove it and set{" "}
          <span className="text-[#00ff66] font-bold">{newFav}</span> as your new
          favorite?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-[rgba(71,72,69,0.3)] text-[11px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-[#00ff66] text-[#0a0b09] text-[11px] font-bold tracking-widest uppercase hover:bg-[#00e65c] transition-colors shadow-[0_0_20px_rgba(0,255,102,0.2)]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Teams Page Content ────────────────────────────────────────────────────────

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

function TeamsPageContent() {
  const [teamType, setTeamType] = useState<"club" | "national">("club");
  const [name, setName] = useState("");
  const [leagueName, setLeagueName] = useState("");
  const [nationalityName, setNationalityName] = useState("");
  const [minOverall, setMinOverall] = useState<number | undefined>();
  const [maxOverall, setMaxOverall] = useState<number | undefined>();
  const [minAttack, setMinAttack] = useState<number | undefined>();
  const [minMidfield, setMinMidfield] = useState<number | undefined>();
  const [minDefence, setMinDefence] = useState<number | undefined>();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingFav, setPendingFav] = useState<ITeamsResponse | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce inputs
  const dName = useDebounce(name, 500);
  const dLeague = useDebounce(leagueName, 500);
  const dNationality = useDebounce(nationalityName, 500);
  const dMinOverall = useDebounce(minOverall, 500);
  const dMaxOverall = useDebounce(maxOverall, 500);
  const dMinAttack = useDebounce(minAttack, 500);
  const dMinMidfield = useDebounce(minMidfield, 500);
  const dMinDefence = useDebounce(minDefence, 500);

  const payload: ITeamsPayload = {
    limit: 50,
    teamType,
    name: dName || undefined,
    leagueName: dLeague || undefined,
    nationalityName: dNationality || undefined,
    minOverall: dMinOverall,
    maxOverall: dMaxOverall,
    minAttack: dMinAttack,
    minMidfield: dMinMidfield,
    minDefence: dMinDefence,
  };

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTeams(payload);

  const { data: favTeams = [] } = useGetFavoriteTeam();
  const currentFav = favTeams.length > 0 ? favTeams[0] : null;

  const addFav = useAddFavoriteTeam();
  const removeFav = useRemoveFavoriteTeam();

  const teams = useMemo(() => data?.pages.flat() || [], [data?.pages]);

  const showToast = useCallback((message: string, type: ToastState["type"]) => {
    setToast({ message, type });
  }, []);

  function handleStarClick(team: ITeamsResponse) {
    const isFav = currentFav?.id === team.id;

    if (isFav) {
      removeFav.mutate(team.id, {
        onSuccess: () =>
          showToast(`${team.name} removed from favourites`, "error"),
        onError: () => showToast("Failed to remove favourite", "error"),
      });
    } else if (currentFav) {
      // Already has a different favorite
      setPendingFav(team);
    } else {
      // No favorite yet
      addFav.mutate(team.id, {
        onSuccess: () => showToast(`${team.name} set as favourite`, "success"),
        onError: () => showToast("Failed to set favourite", "error"),
      });
    }
  }

  async function handleConfirmFavChange() {
    if (!pendingFav || !currentFav) return;

    try {
      // Remove current and add new
      await removeFav.mutateAsync(currentFav.id);
      await addFav.mutateAsync(pendingFav.id);
      showToast(`${pendingFav.name} set as new favourite`, "success");
    } catch (err) {
      showToast("Failed to update favourite", "error");
    } finally {
      setPendingFav(null);
    }
  }

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

  const hasActiveFilters =
    !!name ||
    !!leagueName ||
    !!nationalityName ||
    minOverall !== undefined ||
    maxOverall !== undefined ||
    minAttack !== undefined ||
    minMidfield !== undefined ||
    minDefence !== undefined;

  function clearFilters() {
    setName("");
    setLeagueName("");
    setNationalityName("");
    setMinOverall(undefined);
    setMaxOverall(undefined);
    setMinAttack(undefined);
    setMinMidfield(undefined);
    setMinDefence(undefined);
  }

  return (
    <div className="min-h-screen bg-[#0a0b09] text-[#fcfcf8] font-[Oxanium,sans-serif]">
      {/* ── Page Header ── */}
      <div className="border-b border-[rgba(71,72,69,0.2)] px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-[Bebas_Neue,sans-serif] text-[28px] tracking-[0.06em] text-[#fcfcf8]">
            Clubs
          </h1>
          {isFetching && (
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2.5 py-1 rounded-[4px] animate-pulse">
              Updating…
            </span>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-xl self-start md:self-auto">
          <button
            onClick={() => setTeamType("club")}
            className={`
              px-6 py-2 rounded-lg text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-200
              ${
                teamType === "club"
                  ? "bg-[#00ff66] text-[#0a0b09] shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                  : "text-[rgba(255,255,255,0.4)] hover:text-white"
              }
            `}
          >
            Club Teams
          </button>
          <button
            onClick={() => setTeamType("national")}
            className={`
              px-6 py-2 rounded-lg text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-200
              ${
                teamType === "national"
                  ? "bg-[#00ff66] text-[#0a0b09] shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                  : "text-[rgba(255,255,255,0.4)] hover:text-white"
              }
            `}
          >
            National Teams
          </button>
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
              <span className={LABEL}>Team Name</span>
              <input
                className={INPUT}
                placeholder="Search by name…"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* League - Only show for Clubs */}
            {teamType === "club" && (
              <div className="flex flex-col gap-1.5">
                <span className={LABEL}>League</span>
                <input
                  className={INPUT}
                  placeholder="e.g. Premier League"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                />
              </div>
            )}

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Country</span>
              <input
                className={INPUT}
                placeholder="e.g. England, Spain"
                value={nationalityName}
                onChange={(e) => setNationalityName(e.target.value)}
              />
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

            {/* Attack */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Min Attack</span>
              <input
                className={INPUT}
                type="number"
                placeholder="Min Attack"
                min={1}
                max={99}
                value={minAttack ?? ""}
                onChange={(e) =>
                  setMinAttack(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>

            {/* Midfield */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Min Midfield</span>
              <input
                className={INPUT}
                type="number"
                placeholder="Min Midfield"
                min={1}
                max={99}
                value={minMidfield ?? ""}
                onChange={(e) =>
                  setMinMidfield(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>

            {/* Defence */}
            <div className="flex flex-col gap-1.5">
              <span className={LABEL}>Min Defence</span>
              <input
                className={INPUT}
                type="number"
                placeholder="Min Defence"
                min={1}
                max={99}
                value={minDefence ?? ""}
                onChange={(e) =>
                  setMinDefence(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
          </div>
        </aside>

        {/* ── Teams Grid ── */}
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
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <div className="w-14 h-14 rounded-full border border-[rgba(71,72,69,0.3)] flex items-center justify-center text-2xl mb-2">
                🔍
              </div>
              <p className="font-[Bebas_Neue,sans-serif] text-[22px] tracking-[0.06em] text-[rgba(255,255,255,0.3)]">
                No {teamType === "club" ? "Clubs" : "National Teams"} Found
              </p>
              <p className="text-[11px] text-[rgba(255,255,255,0.2)] tracking-[0.08em] max-w-xs">
                Try adjusting your filters to find teams.
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
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    isFavorite={currentFav?.id === team.id}
                    onStarClick={handleStarClick}
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

      {/* ── Confirmation Modal ── */}
      {pendingFav && currentFav && (
        <ConfirmModal
          currentFav={currentFav.name}
          newFav={pendingFav.name}
          onConfirm={handleConfirmFavChange}
          onCancel={() => setPendingFav(null)}
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

export default function TeamsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0b09] flex items-center justify-center text-[#00ff66] font-[Bebas_Neue]">
          Loading...
        </div>
      }
    >
      <TeamsPageContent />
    </Suspense>
  );
}
