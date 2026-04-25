"use client";

import { useState, useMemo, Suspense, useCallback } from "react";
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
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import { useToast } from "@/lib/hooks/useToast";
import { Toast } from "@/components/common/Toast";
import { StatBadge } from "@/components/common/StatBadge";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { FilterSidebar } from "@/components/common/FilterSidebar";
import { DatabaseGrid } from "@/components/common/DatabaseGrid";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmModal } from "@/components/common/ConfirmModal";

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
        group
      "
    >
      {/* Button is a sibling to the clickable content — no stopPropagation needed */}
      <FavoriteButton
        isFavorite={isFavorite}
        onClick={() => onStarClick(team)}
      />
      <div className="flex flex-col cursor-pointer">
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
    </div>
  );
}

// ── Teams Page Content ────────────────────────────────────────────────────────

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
  const [pendingFav, setPendingFav] = useState<ITeamsResponse | null>(null);

  const { toast, showToast, dismissToast } = useToast();

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

  const observerRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  function handleStarClick(team: ITeamsResponse) {
    const isFav = currentFav?.id === team.id;

    if (isFav) {
      removeFav.mutate(team.id, {
        onSuccess: () =>
          showToast(`${team.name} removed from favourites`, "error"),
        onError: () => showToast("Failed to remove favourite", "error"),
      });
    } else if (currentFav) {
      setPendingFav(team);
    } else {
      addFav.mutate(team.id, {
        onSuccess: () => showToast(`${team.name} set as favourite`, "success"),
        onError: () => showToast("Failed to set favourite", "error"),
      });
    }
  }

  async function handleConfirmFavChange() {
    if (!pendingFav || !currentFav) return;
    try {
      await removeFav.mutateAsync(currentFav.id);
      await addFav.mutateAsync(pendingFav.id);
      showToast(`${pendingFav.name} set as new favourite`, "success");
    } catch {
      showToast("Failed to update favourite", "error");
    } finally {
      setPendingFav(null);
    }
  }

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
      <PageHeader title="Teams Database" isFetching={isFetching}>
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
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-0 max-w-[1600px] mx-auto">
        <FilterSidebar
          isOpen={isFiltersOpen}
          onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        >
          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Team Name</span>
            <input
              className={INPUT}
              placeholder="Search by name…"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Country</span>
            <input
              className={INPUT}
              placeholder="e.g. England, Spain"
              value={nationalityName}
              onChange={(e) => setNationalityName(e.target.value)}
            />
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
        </FilterSidebar>

        <main className="flex-1 p-5">
          <DatabaseGrid
            isLoading={isLoading}
            isEmpty={teams.length === 0}
            emptyLabel={`No ${teamType === "club" ? "Clubs" : "National Teams"} Found`}
            emptySubtext="Try adjusting your filters to find teams."
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            observerRef={observerRef}
          >
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                isFavorite={currentFav?.id === team.id}
                onStarClick={handleStarClick}
              />
            ))}
          </DatabaseGrid>
        </main>
      </div>

      {pendingFav && currentFav && (
        <ConfirmModal
          currentFav={currentFav.name}
          newFav={pendingFav.name}
          onConfirm={handleConfirmFavChange}
          onCancel={() => setPendingFav(null)}
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
