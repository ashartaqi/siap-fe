"use client";

import Image from "next/image";
import { useEffect, useRef, useMemo } from "react";
import {
  useInfinitePlayers,
  type IPlayersPayload,
  type IPlayersResponse,
} from "@/features/main/dashboard";

import { Lock } from "lucide-react";
import { TAxiosError } from "@/types/api";
import { useUnlockPlayer } from "@/features/main/dashboard/hooks/useUnlockPlayer";
import { toast } from "sonner";

interface PlayerBrowserListProps {
  payload: IPlayersPayload;
  onSelectPlayer: (player: IPlayersResponse) => void;
  renderRightSlot?: (player: IPlayersResponse) => React.ReactNode;
  isPlayerDisabled?: (player: IPlayersResponse) => boolean;
}

/**
 * Shared infinite-scroll player list.
 * Used by: TeamDetailModal (squad tab) and PlayerPickerModal.
 */
export function PlayerBrowserList({
  payload,
  onSelectPlayer,
  renderRightSlot,
  isPlayerDisabled = () => false,
}: PlayerBrowserListProps) {
  const { mutate: unlockPlayer, isPending: isUnlocking } = useUnlockPlayer();

  const getUnlockPrice = (overall: number) => {
    if (overall < 70) return 0;
    if (overall < 80) return 30;
    if (overall < 85) return 40;
    if (overall < 90) return 50;
    return 100;
  };
  // Keep latest pagination state in a ref so the observer callback never
  // captures stale closures — observer is created once, reads fresh values via ref.
  const paginationRef = useRef<{
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
  }>({
    hasNextPage: undefined,
    isFetchingNextPage: false,
    fetchNextPage: () => {},
  });

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePlayers(payload, payload.limit ?? 15);

  useEffect(() => {
    paginationRef.current = { hasNextPage, isFetchingNextPage, fetchNextPage };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Deduplicate by id — offset-based pagination can return the same player at page boundaries
  const players = useMemo(() => {
    const flat = data?.pages.flat() ?? [];
    const seen = new Set<number>();
    return flat.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [data?.pages]);

  // Callback ref — fires whenever the sentinel DOM node mounts/unmounts.
  // This is the correct pattern for conditionally-rendered scroll sentinels.
  const sentinelRef = (node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const { hasNextPage, isFetchingNextPage, fetchNextPage } =
          paginationRef.current;
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    // Cleanup is handled when the sentinel unmounts (conditional render removes it)
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-lg bg-[rgba(255,255,255,0.04)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center py-8 text-[12px] text-[rgba(255,80,80,0.7)] tracking-[0.1em]">
        {error instanceof Error ? error.message : "Failed to fetch players"}
      </p>
    );
  }

  if (players.length === 0) {
    return (
      <p className="text-center py-8 text-[12px] text-[rgba(255,255,255,0.25)] tracking-[0.1em]">
        No players found — adjust filters
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {players.map((p) => {
        const isLocked = p.overall >= 70 && !p.is_unlocked;
        const disabled = isPlayerDisabled(p) || (isLocked && !isUnlocking);
        const price = getUnlockPrice(p.overall);

        return (
          <div
            key={p.id}
            onClick={() => {
              if (isLocked) {
                if (window.confirm(`Unlock ${p.short_name} for ${price} BB?`)) {
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
              if (!disabled) onSelectPlayer(p);
            }}
            className={[
              "flex items-center gap-3 px-3 py-2.5 rounded-lg relative overflow-hidden",
              "bg-[rgba(36,39,35,0.6)] border border-[rgba(71,72,69,0.15)]",
              "transition-all duration-200",
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

            {/* Avatar */}
            <div
              className={`w-11 h-11 rounded-[6px] overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center ${isLocked ? "blur-sm" : ""}`}
            >
              {p.player_face_url ? (
                <Image
                  src={p.player_face_url}
                  alt={p.short_name}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                  unoptimized
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : (
                <span className="text-[rgba(0,255,102,0.3)] text-xl">👤</span>
              )}
            </div>

            {/* Identity */}
            <div className={`flex-1 min-w-0 ${isLocked ? "blur-sm" : ""}`}>
              <div className="text-[13px] font-semibold text-[#fcfcf8] truncate">
                {p.short_name}
              </div>
              <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-0.5 tracking-[0.04em] truncate">
                {p.positions?.join(" · ")} · {p.club_name ?? p.nationality_name}{" "}
                · Age {p.age} · {p.preferred_foot} foot
              </div>
            </div>

            {/* Right slot */}
            <div className={isLocked ? "blur-sm" : ""}>
              {renderRightSlot ? (
                renderRightSlot(p)
              ) : (
                <div className="font-[Bebas_Neue,sans-serif] text-[26px] text-[#00ff66] leading-none shrink-0">
                  {p.overall}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Infinite-scroll sentinel — only rendered when more pages exist */}
      {(hasNextPage || isFetchingNextPage) && (
        <div
          ref={sentinelRef}
          className="h-10 w-full flex items-center justify-center mt-2"
        >
          <div className="w-5 h-5 border-2 border-[#00ff66] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
