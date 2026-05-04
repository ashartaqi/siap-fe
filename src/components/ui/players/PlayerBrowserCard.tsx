"use client";

import { Heart } from "lucide-react";
import type { IPlayersResponse } from "@/features/main/dashboard";

interface PlayerBrowserCardProps {
  player: IPlayersResponse;
  isFav: boolean;
  onToggleFav: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export function PlayerBrowserCard({
  player,
  isFav,
  onToggleFav,
  onClick,
}: PlayerBrowserCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,254,102,0.08)]"
    >
      <div className="absolute inset-0 bg-surface-container-low border border-outline-variant/10 rounded-2xl group-hover:border-primary-container/25 transition-colors duration-300" />

      <button
        onClick={onToggleFav}
        className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
          isFav
            ? "bg-primary-container/15 text-primary-container scale-110"
            : "bg-surface-container-highest/60 text-on-surface-variant/40 opacity-0 group-hover:opacity-100 hover:text-primary-container hover:bg-primary-container/10"
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
      </button>

      {isFav && (
        <div className="absolute top-3 left-3 z-20">
          <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-primary-container bg-primary-container/10 border border-primary-container/20 px-1.5 py-0.5 rounded-full">
            ★ FAV
          </span>
        </div>
      )}

      <div className="relative z-10 pt-6 pb-2 flex justify-center">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-outline-variant/15 group-hover:border-primary-container/30 transition-colors duration-300 bg-surface-container-highest">
          {player.player_face_url ? (
            <img
              src={player.player_face_url}
              alt={player.short_name}
              className="w-full h-full object-cover object-top"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl text-on-surface-variant/20 font-display">
                {player.short_name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 px-3 pb-4 text-center">
        <h3 className="font-headline font-bold text-sm text-on-surface truncate leading-tight">
          {player.short_name}
        </h3>
        <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5 truncate">
          {player.club_name}
        </p>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary-container/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
