"use client";

import Image from "next/image";
import { useEffect, useRef, useMemo } from "react";
import {
  useInfinitePlayers,
  type IPlayersPayload,
  type IPlayersResponse,
} from "@/features/main/dashboard";

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
        const disabled = isPlayerDisabled(p);
        return (
          <div
            key={p.id}
            onClick={() => {
              if (!disabled) onSelectPlayer(p);
            }}
            className={[
              "flex items-center gap-3 px-3 py-2.5 rounded-lg",
              "bg-[rgba(36,39,35,0.6)] border border-[rgba(71,72,69,0.15)]",
              "transition-all duration-200",
              disabled
                ? "opacity-35 cursor-not-allowed"
                : "cursor-pointer hover:border-[rgba(0,255,102,0.3)] hover:bg-[rgba(0,255,102,0.04)]",
            ].join(" ")}
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-[6px] overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center">
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
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#fcfcf8] truncate">
                {p.short_name}
              </div>
              <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-0.5 tracking-[0.04em] truncate">
                {p.positions?.join(" · ")} · {p.club_name ?? p.nationality_name}{" "}
                · Age {p.age} · {p.preferred_foot} foot
              </div>
            </div>

            {/* Right slot — caller decides; defaults to overall rating */}
            {renderRightSlot ? (
              renderRightSlot(p)
            ) : (
              <div className="font-[Bebas_Neue,sans-serif] text-[26px] text-[#00ff66] leading-none shrink-0">
                {p.overall}
              </div>
            )}
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
