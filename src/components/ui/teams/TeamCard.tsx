"use client";

import { useState } from "react";
import Image from "next/image";
import { ITeamsResponse } from "@/features/main/dashboard";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { StatBadge } from "@/components/common/StatBadge";

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
        relative bg-[rgba(18,20,17,0.92)] border border-[rgba(71,72,69,0.2)]
        hover:border-[rgba(0,255,102,0.3)] hover:bg-[rgba(0,255,102,0.03)]
        rounded-xl overflow-hidden transition-all duration-200 flex flex-col
        group
      "
    >
      <FavoriteButton
        isFavorite={isFavorite}
        onClick={() => onStarClick(team)}
      />
      <div
        onClick={() => onCardClick(team)}
        className="flex flex-col cursor-pointer"
      >
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
