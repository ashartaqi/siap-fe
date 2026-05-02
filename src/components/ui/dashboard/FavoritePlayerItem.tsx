"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useRemoveFavoritePlayer,
  type IPlayersResponse,
} from "@/features/main/dashboard";
import { useGetTeamUpcomingFixtures } from "@/features/main/football";
import { FavoriteButton } from "@/components/common/buttons/FavoriteButton";
import { Toast } from "@/components/common/Toast";

interface FavoritePlayerItemProps {
  player: IPlayersResponse;
  onOpen: (player: IPlayersResponse) => void;
}

export function FavoritePlayerItem({
  player,
  onOpen,
}: FavoritePlayerItemProps) {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "blue";
  } | null>(null);
  const removeFav = useRemoveFavoritePlayer();

  const { data: upcomingFixes = [], isLoading: upcomingLoading } =
    useGetTeamUpcomingFixtures(player.club_name ?? undefined, 2);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFav.mutate(player.id, {
      onSuccess: () => {
        setToast({
          message: `${player.short_name} removed from favorites`,
          type: "info",
        });
      },
      onError: () => {
        setToast({
          message: `Failed to remove ${player.short_name}`,
          type: "error",
        });
      },
    });
  };

  return (
    <>
      <div className="bg-surface-container-low rounded-lg border border-outline-variant/10 relative overflow-hidden mb-4 hover:border-[#00ff66]/30 transition-all group flex flex-col">
        <FavoriteButton isFavorite={true} onClick={handleRemove} />

        <div
          onClick={() => onOpen(player)}
          className="p-6 cursor-pointer flex-1"
        >
          <div className="flex items-center justify-between gap-4 mb-4 pr-6">
            <div>
              <h4 className="font-headline font-black text-lg uppercase mb-1 leading-tight break-words group-hover:text-[#00ff66] transition-colors">
                {player.short_name}
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-xs text-on-surface-variant uppercase truncate max-w-[160px]">
                  {player.positions?.join(" | ")} |{" "}
                  {player.club_name || "Free Agent"}
                </p>
                <span className="bg-primary-container text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(0,255,102,0.15)]">
                  {player.overall?.toString().padStart(2, "0")} OVR
                </span>
              </div>
            </div>
            {player.player_face_url && (
              <Image
                src={player.player_face_url}
                alt={player.short_name}
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-full border-2 border-primary-container/20 shadow-lg flex-none transition-transform group-hover:scale-110"
                unoptimized
              />
            )}
          </div>

          {/* Upcoming Fixtures for Player's Team */}
          {player.club_name && (
            <div className="mt-4 pt-4 border-t border-outline-variant/5">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary-container mb-3">
                Team Schedule
              </p>
              <div className="space-y-2">
                {upcomingLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-8 bg-surface-container-highest rounded" />
                    <div className="h-8 bg-surface-container-highest rounded" />
                  </div>
                ) : upcomingFixes.length === 0 ? (
                  <p className="text-[10px] text-on-surface-variant italic">
                    No upcoming matches scheduled.
                  </p>
                ) : (
                  upcomingFixes.map((f) => {
                    const isHome = f.home_team
                      .toLowerCase()
                      .includes(player.club_name!.toLowerCase());
                    const opp = isHome ? f.away_team : f.home_team;
                    const date = new Date(f.date ?? "").toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                      },
                    );
                    return (
                      <div
                        key={f.id}
                        className="flex items-center justify-between bg-surface-container-highest/30 px-2 py-1.5 rounded border border-white/5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`text-[8px] font-bold px-1 rounded ${isHome ? "bg-primary-container/20 text-[#00ff66]" : "bg-white/5 text-on-surface-variant"}`}
                          >
                            {isHome ? "H" : "A"}
                          </span>
                          <span className="text-[11px] font-medium truncate">
                            vs {opp}
                          </span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-bold tabular-nums ml-2">
                          {date}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
