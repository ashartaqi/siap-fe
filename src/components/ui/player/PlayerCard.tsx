"use client";

import { useState } from "react";
import Image from "next/image";
import { StatBadge } from "@/components/common/stats/StatBadge";
import { FavoriteButton } from "@/components/common/buttons/FavoriteButton";
import { calculateAge } from "@/lib/utils/footballUtils";
import { IPlayersResponse } from "@/features/main/dashboard";

export interface PlayerCardProps {
  player: IPlayersResponse;
  isFavorite: boolean;
  onStarClick: (player: IPlayersResponse) => void;
  onCardClick: (player: IPlayersResponse) => void;
}

export function PlayerCard({
  player,
  isFavorite,
  onStarClick,
  onCardClick,
}: PlayerCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const age = calculateAge(player.dob);

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
        onClick={(e) => {
          e.stopPropagation();
          onStarClick(player);
        }}
      />
      <div
        onClick={() => onCardClick(player)}
        className="flex flex-col cursor-pointer"
      >
        {/* Top: avatar + identity */}
        <div className="flex items-center gap-3 p-4 border-b border-[rgba(71,72,69,0.12)] pr-14">
          <div className="w-[52px] h-[52px] rounded-lg overflow-hidden bg-[rgba(36,39,35,0.9)] border border-[rgba(71,72,69,0.2)] shrink-0 flex items-center justify-center">
            {player.player_face_url && !imgErr ? (
              <Image
                src={player.player_face_url}
                alt={player.short_name}
                width={52}
                height={52}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                unoptimized
                loading="eager"
                onError={() => setImgErr(true)}
              />
            ) : (
              <span className="text-[rgba(0,255,102,0.3)] text-2xl">👤</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-[Bebas_Neue,sans-serif] text-[20px] text-[#fcfcf8] leading-none truncate">
                {player.short_name}
              </span>
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#00ff66] bg-[rgba(0,255,102,0.08)] border border-[rgba(0,255,102,0.2)] px-2 py-0.5 rounded-[4px]">
                {player.positions?.join(" · ") ?? "—"}
              </span>
            </div>
            <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1 tracking-[0.05em] truncate">
              {player.club_name || "Free Agent"} · {player.nationality_name} ·
              Age {age}
            </div>
            <div className="text-[10px] text-[rgba(255,255,255,0.25)] mt-0.5 tracking-[0.05em]">
              {player.preferred_foot} foot · {player.work_rate}
            </div>
          </div>

          <div className="font-[Bebas_Neue,sans-serif] text-[38px] text-[#00ff66] leading-none shrink-0">
            {player.overall}
          </div>
        </div>

        {/* Bottom: stats */}
        {player.goalkeeper_stats ? (
          <div className="flex gap-1.5 flex-wrap px-4 py-3 justify-between">
            <StatBadge label="DIV" value={player.goalkeeper_stats.diving} />
            <StatBadge label="HAN" value={player.goalkeeper_stats.handling} />
            <StatBadge label="KIC" value={player.goalkeeper_stats.kicking} />
            <StatBadge
              label="POS"
              value={player.goalkeeper_stats.positioning}
            />
            <StatBadge label="REF" value={player.goalkeeper_stats.reflexes} />
            <StatBadge label="SPD" value={player.goalkeeper_stats.speed} />
          </div>
        ) : (
          <div className="flex gap-1.5 flex-wrap px-4 py-3 justify-between">
            <StatBadge label="PAC" value={player.player_stats?.pace} />
            <StatBadge label="SHO" value={player.player_stats?.shooting} />
            <StatBadge label="PAS" value={player.player_stats?.passing} />
            <StatBadge label="DRI" value={player.player_stats?.dribbling} />
            <StatBadge label="DEF" value={player.player_stats?.defending} />
            <StatBadge label="PHY" value={player.player_stats?.physic} />
          </div>
        )}
      </div>
    </div>
  );
}
