"use client";

import Image from "next/image";
import { useEffect, useRef, useMemo, useState } from "react";
import {
  useInfinitePlayers,
  IPlayersPayload,
  IPlayersResponse,
} from "@/features/main/dashboard";
import { INPUT, LABEL } from "@/lib/constants";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { getStatValue } from "@/lib/utils/dreamPlayerUtils";
import { StatKey } from "@/types/dreamPlayer";

import { useUnlockPlayer } from "@/features/main/dashboard/hooks/useUnlockPlayer";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { TAxiosError } from "@/types/api";

interface Props {
  label: string;
  isGK?: boolean;
  usedPlayerIds: Set<number>;
  onClose: () => void;
  onSelect: (player: IPlayersResponse) => void;
  ratingPosition?: string;
  statKey?: string;
  statFieldMap?: Record<string, string>;
}

export function PlayerPickerModal({
  label,
  isGK = false,
  usedPlayerIds,
  onClose,
  onSelect,
  ratingPosition,
  statKey,
  statFieldMap,
}: Props) {
  const { mutate: unlockPlayer, isPending: isUnlocking } = useUnlockPlayer();

  const getUnlockPrice = (overall: number) => {
    if (overall < 70) return 0;
    if (overall < 80) return 30;
    if (overall < 85) return 40;
    if (overall < 90) return 50;
    return 100;
  };
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState<number | undefined>();
  const [minOverall, setMinOverall] = useState<number | undefined>();
  const [maxOverall, setMaxOverall] = useState<number | undefined>();
  const [position, setPosition] = useState(isGK ? "GK" : "");
  const [nationalityName, setNationalityName] = useState("");
  const [minAge, setMinAge] = useState<number | undefined>();
  const [maxAge, setMaxAge] = useState<number | undefined>();
  const [preferredFoot, setPreferredFoot] = useState("");
  const [statFilter, setStatFilter] = useState<number | undefined>();
  const [unlockStatus, setUnlockStatus] = useState<
    "all" | "locked" | "unlocked"
  >("all");

  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce inputs to avoid hammering API
  const dName = useDebounce(name, 500);
  const dMinOverall = useDebounce(minOverall, 500);
  const dMaxOverall = useDebounce(maxOverall, 500);
  const dPosition = useDebounce(position, 500);
  const dNationality = useDebounce(nationalityName, 500);
  const dMinAge = useDebounce(minAge, 500);
  const dMaxAge = useDebounce(maxAge, 500);
  const dStatFilter = useDebounce(statFilter, 500);

  const payload: IPlayersPayload = {
    limit: 10,
    name: dName || undefined,
    teamId,
    minOverall: dMinOverall,
    maxOverall: dMaxOverall,
    position: dPosition || undefined,
    nationalityName: dNationality || undefined,
    minAge: dMinAge,
    maxAge: dMaxAge,
    preferredFoot: preferredFoot || undefined,
    orderByStat: statKey,
    unlockStatus: unlockStatus !== "all" ? unlockStatus : undefined,
    ...(statKey && dStatFilter !== undefined ? { [statKey]: dStatFilter } : {}),
  };

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePlayers(payload, 10);

  const players = useMemo(() => data?.pages.flat() || [], [data?.pages]);

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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-[6px] z-[1000] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[rgba(18,20,17,0.92)] border border-[rgba(0,255,102,0.15)] rounded-2xl w-[min(680px,95vw)] max-h-[85vh] flex flex-col overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(71,72,69,0.2)] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="font-[Bebas_Neue,sans-serif] text-[22px] text-[#fcfcf8] tracking-[0.04em]">
              Select Player
            </span>
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2.5 py-1 rounded-[4px]">
              {label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 text-xl leading-none p-1 transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2.5 px-5 py-4 border-b border-[rgba(71,72,69,0.2)] shrink-0">
          <div className="col-span-2 flex flex-col gap-1.5">
            <span className={LABEL}>Player Name</span>
            <input
              className={INPUT}
              placeholder="Search by name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {statKey && (
            <div className="col-span-2 flex flex-col gap-1.5">
              <span className={LABEL}>
                {statKey.charAt(0).toUpperCase() + statKey.slice(1)} (exact)
              </span>
              <input
                className={INPUT}
                type="number"
                placeholder={`Filter by ${statKey} value...`}
                value={statFilter ?? ""}
                onChange={(e) =>
                  setStatFilter(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-1.5">
            <span className={LABEL}>Team ID</span>
            <input
              className={INPUT}
              type="number"
              placeholder="Enter team ID..."
              value={teamId ?? ""}
              onChange={(e) =>
                setTeamId(e.target.value ? +e.target.value : undefined)
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Position</span>
            <input
              className={INPUT}
              placeholder="e.g. ST, CM, GK"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Nationality</span>
            <input
              className={INPUT}
              placeholder="e.g. Brazil"
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
                value={minOverall ?? ""}
                onChange={(e) =>
                  setMinOverall(e.target.value ? +e.target.value : undefined)
                }
              />
              <span className="text-white/20 text-[11px] shrink-0">–</span>
              <input
                className={INPUT}
                type="number"
                placeholder="Max"
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
                value={minAge ?? ""}
                onChange={(e) =>
                  setMinAge(e.target.value ? +e.target.value : undefined)
                }
              />
              <span className="text-white/20 text-[11px] shrink-0">–</span>
              <input
                className={INPUT}
                type="number"
                placeholder="Max"
                value={maxAge ?? ""}
                onChange={(e) =>
                  setMaxAge(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Preferred Foot</span>
            <select
              className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-2.5 py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-colors appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)]"
              value={preferredFoot}
              onChange={(e) => setPreferredFoot(e.target.value)}
            >
              <option value="">Any</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Unlock Status</span>
            <select
              className="w-full bg-[rgba(36,39,35,0.8)] border border-[rgba(71,72,69,0.3)] rounded-[6px] px-2.5 py-2 font-[Oxanium,sans-serif] text-[12px] text-[#fcfcf8] outline-none transition-colors appearance-none cursor-pointer focus:border-[rgba(0,255,102,0.4)]"
              value={unlockStatus}
              onChange={(e) =>
                setUnlockStatus(e.target.value as "all" | "locked" | "unlocked")
              }
            >
              <option value="all">All</option>
              <option value="unlocked">Unlocked</option>
              <option value="locked">Locked</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 px-5 pt-4 pb-5">
          <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00ff66] mb-2.5">
            Results
          </div>
          {isLoading && (
            <div className="text-center py-10 text-[12px] text-white/25 tracking-[0.1em]">
              Searching...
            </div>
          )}
          {isError && (
            <div className="text-center py-10 text-[12px] text-[rgba(255,80,80,0.7)] tracking-[0.1em]">
              {error instanceof Error
                ? error.message
                : "Failed to fetch players"}
            </div>
          )}
          {!isLoading && !isError && players.length === 0 && (
            <div className="text-center py-10 text-[12px] text-white/25 tracking-[0.1em]">
              No players found — adjust filters
            </div>
          )}
          {!isLoading &&
            !isError &&
            players.map((p, idx) => {
              const isUsed = usedPlayerIds.has(p.id);
              const isLocked = p.overall >= 70 && !p.is_unlocked;
              const disabled = isUsed || (isLocked && !isUnlocking);
              const price = getUnlockPrice(p.overall);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isLocked) {
                      if (
                        window.confirm(
                          `Unlock ${p.short_name} for ${price} BB?`,
                        )
                      ) {
                        unlockPlayer(p.id, {
                          onSuccess: (data) => toast.success(data.message),
                          onError: (err: TAxiosError) =>
                            toast.error(
                              err.response?.data?.detail || "Failed to unlock",
                            ),
                        });
                      }
                      return;
                    }
                    if (!isUsed) onSelect(p as IPlayersResponse);
                  }}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2 relative overflow-hidden",
                    "bg-[rgba(36,39,35,0.6)] border border-[rgba(71,72,69,0.15)]",
                    "transition-[border-color,background,opacity] duration-200",
                    disabled && !isLocked
                      ? "opacity-35 cursor-not-allowed"
                      : "cursor-pointer hover:border-[rgba(0,255,102,0.3)] hover:bg-[rgba(0,255,102,0.04)]",
                  ].join(" ")}
                >
                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10 group/lock">
                      <div className="flex flex-col items-center gap-1 group-hover/lock:scale-110 transition-transform">
                        <Lock className="w-4 h-4 text-[var(--color-neon)]" />
                        <span className="text-[9px] font-black tracking-widest text-white uppercase">
                          Unlock {price} BB
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className={`w-11 h-11 rounded-[6px] overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center ${isLocked ? "blur-sm" : ""}`}
                  >
                    {p.player_face_url ? (
                      <Image
                        src={p.player_face_url}
                        alt={p.short_name}
                        referrerPolicy="no-referrer"
                        width={44}
                        height={44}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                        unoptimized
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[18px] text-[rgba(0,255,102,0.3)]">
                        person
                      </span>
                    )}
                  </div>
                  <div
                    className={`flex-1 min-w-0 ${isLocked ? "blur-sm" : ""}`}
                  >
                    <div className="text-[13px] font-semibold text-[#fcfcf8] truncate">
                      {p.short_name}
                    </div>
                    <div className="text-[10px] text-white/35 mt-0.5 tracking-[0.05em]">
                      {p.positions?.join(" · ")} · {p.club_name} · Age {p.age} ·{" "}
                      {p.preferred_foot} foot
                    </div>
                  </div>
                  <div className={isLocked ? "blur-sm" : ""}>
                    {isUsed ? (
                      <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-[rgba(255,100,100,0.7)] bg-[rgba(255,100,100,0.08)] border border-[rgba(255,100,100,0.2)] px-1.5 py-0.5 rounded-[3px] shrink-0">
                        In Squad
                      </span>
                    ) : (
                      <div className="font-[Bebas_Neue,sans-serif] text-[26px] text-[#00ff66] leading-none shrink-0">
                        {statKey
                          ? getStatValue(p, statKey as StatKey, statFieldMap)
                          : ratingPosition
                            ? (p as unknown as Record<string, number>)[
                                ratingPosition.toLowerCase()
                              ] || p.overall
                            : p.overall}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {(hasNextPage || isFetchingNextPage) && (
            <div
              ref={observerTarget}
              className="h-10 w-full flex items-center justify-center mt-2"
            >
              <div className="w-5 h-5 border-2 border-[#00ff66] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
