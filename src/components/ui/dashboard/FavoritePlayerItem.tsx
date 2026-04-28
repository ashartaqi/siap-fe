"use client";

import Image from "next/image";
import {
  useRemoveFavoritePlayer,
  type IPlayersResponse,
} from "@/features/main/dashboard";

interface FavoritePlayerItemProps {
  player: IPlayersResponse;
  onOpen: (player: IPlayersResponse) => void;
}

export function FavoritePlayerItem({
  player,
  onOpen,
}: FavoritePlayerItemProps) {
  const removeFav = useRemoveFavoritePlayer();

  return (
    <div className="bg-surface-container-low rounded-lg border border-outline-variant/10 relative overflow-hidden mb-4 hover:border-[#00ff66]/30 transition-all group">
      <button
        onClick={() => removeFav.mutate(player.id)}
        title="Remove from favourites"
        className="
          absolute top-3 right-3 z-10
          w-7 h-7 flex items-center justify-center rounded-full
          border transition-all duration-200 text-[15px] leading-none
          text-[#ffd700] border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.08)] hover:bg-[rgba(255,80,80,0.1)] hover:border-[rgba(255,80,80,0.35)] hover:text-[rgba(255,80,80,0.9)]
        "
      >
        ★
      </button>

      <div onClick={() => onOpen(player)} className="p-6 cursor-pointer">
        <div className="flex items-center justify-between gap-4 mb-6 pr-6">
          <div>
            <h4 className="font-headline font-black text-lg uppercase mb-1 leading-tight break-words">
              {player.short_name}
            </h4>
            <div className="flex items-center gap-2">
              <p className="text-xs text-on-surface-variant uppercase truncate max-w-[160px]">
                {player.positions?.join(" | ")} |{" "}
                {player.club_name || "Free Agent"}
              </p>
              <span className="bg-primary-container text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
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
              className="w-12 h-12 object-cover rounded-full border-2 border-primary-container/20 shadow-lg flex-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
