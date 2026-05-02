"use client";

import { useState } from "react";
import Image from "next/image";
import { ITeamsResponse } from "@/features/main/dashboard";
import { FavoriteButton } from "@/components/common/buttons/FavoriteButton";
import { StatBadge } from "@/components/common/stats/StatBadge";

interface TeamCardProps {
  team: ITeamsResponse;
  isFavorite: boolean;
  onStarClick: (team: ITeamsResponse) => void;
  onCardClick: (team: ITeamsResponse) => void;
}

export function TeamCard({
  team,
  isFavorite,
  onStarClick,
  onCardClick,
}: TeamCardProps) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="
        relative bg-[var(--color-surface)] border border-[var(--color-border)]
        hover:border-[var(--color-neon)] hover:shadow-[0_0_15px_var(--color-neon)]
        rounded-xl overflow-hidden transition-all duration-200 flex flex-col
        group
      "
    >
      <FavoriteButton
        isFavorite={isFavorite}
        onClick={(e) => {
          e.stopPropagation();
          onStarClick(team);
        }}
      />
      <div
        onClick={() => onCardClick(team)}
        className="flex flex-col cursor-pointer"
      >
        {/* Top: Logo + Identity */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--color-border)] pr-12">
          <div className="w-[52px] h-[52px] rounded-lg overflow-hidden bg-[var(--color-black)] border border-[var(--color-border)] shrink-0 flex items-center justify-center p-1">
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
              <span className="text-[var(--color-neon)] opacity-30 text-2xl">
                🛡️
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-[Bebas_Neue,sans-serif] text-[20px] text-[var(--color-text)] leading-none truncate">
                {team.name}
              </span>
            </div>
            <div className="text-[10px] text-[var(--color-text-muted)] mt-1 tracking-[0.05em] truncate">
              {team.league_name !== "Friendly International"
                ? team.league_name
                : "National Team"}{" "}
              · {team.nationality_name}
            </div>
            <div className="text-[10px] text-[var(--color-text-muted)] opacity-70 mt-0.5 tracking-[0.05em] truncate">
              🏟️ {team.home_stadium || "National Stadium"}
            </div>
          </div>

          <div className="font-[Bebas_Neue,sans-serif] text-[38px] text-[var(--color-neon)] leading-none shrink-0 transition-colors duration-700">
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
