"use client";

import { useMemo } from "react";
import { RatingBar } from "./RatingBar";
import { categorizePosition } from "@/lib/utils/dreamTeamUtils";
import { useGetPlayerAttributes } from "@/features/main/football";
import type { SelectedPlayers } from "@/types/dreamTeam";

interface Props {
  selectedPlayers: SelectedPlayers;
  tacticalFit: string;
  filledSlots: number;
  totalSlots: number;
  isComplete: boolean;
}

export function SquadAnalysis({
  selectedPlayers,
  tacticalFit,
  filledSlots,
  totalSlots,
  isComplete,
}: Props) {
  const { data: playerAttributes } = useGetPlayerAttributes();
  const validPlayerPositions = playerAttributes?.valid_player_positions;

  const ratings = useMemo(() => {
    const buckets: Record<"attack" | "midfield" | "defense", number[]> = {
      attack: [],
      midfield: [],
      defense: [],
    };
    let gkOverall: number | null = null;
    const gk = selectedPlayers["GK"];
    if (gk) gkOverall = gk.overall;

    Object.entries(selectedPlayers).forEach(([slotId, player]) => {
      if (!player || slotId === "GK") return;
      const pos = slotId.split("-").pop() ?? "";
      const cat = categorizePosition(pos, validPlayerPositions);
      if (cat !== "gk") buckets[cat].push(player.overall);
    });

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    return {
      attack: avg(buckets.attack),
      midfield: avg(buckets.midfield),
      defense: avg(buckets.defense),
      gkOverall,
      total: avg([
        ...buckets.attack,
        ...buckets.midfield,
        ...buckets.defense,
        ...(gkOverall !== null ? [gkOverall] : []),
      ]),
    };
  }, [selectedPlayers, validPlayerPositions]);

  return (
    <div className="bg-[#121411] p-[14px] rounded-xl border border-[rgba(71,72,69,0.12)]">
      <h3 className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#00ff66] mb-[10px]">
        Squad Analysis
      </h3>

      <div className="flex flex-col gap-2">
        <RatingBar
          label="Attack Rating"
          value={ratings.attack}
          filled={ratings.attack !== null}
        />
        <RatingBar
          label="Midfield Rating"
          value={ratings.midfield}
          filled={ratings.midfield !== null}
        />
        <RatingBar
          label="Defense Rating"
          value={ratings.defense}
          filled={ratings.defense !== null}
        />
        <RatingBar
          label="GK Rating"
          value={ratings.gkOverall}
          filled={ratings.gkOverall !== null}
        />
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[rgba(71,72,69,0.12)]">
        <div>
          <span
            className={[
              "block font-[Bebas_Neue,sans-serif] text-[26px] leading-none",
              ratings.total !== null ? "text-[#00ff66]" : "text-white/20",
            ].join(" ")}
          >
            {ratings.total !== null ? Math.round(ratings.total) : "–"}
          </span>
          <span className="block text-[9px] font-bold tracking-[0.14em] uppercase text-white/30 mt-[3px]">
            Total Rating
          </span>
        </div>
        <div className="text-right">
          <span className="block font-[Bebas_Neue,sans-serif] text-[26px] leading-none text-[#00ff66]">
            {tacticalFit}
          </span>
          <span className="block text-[9px] font-bold tracking-[0.14em] uppercase text-white/30 mt-[3px]">
            Tactical Fit
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[rgba(71,72,69,0.12)]">
        <div className="flex justify-between text-[9px] font-bold tracking-[0.18em] uppercase mb-[5px]">
          <span className="text-white/30">Players Selected</span>
          <span className={isComplete ? "text-[#00ff66]" : "text-white/40"}>
            {filledSlots} / {totalSlots}
          </span>
        </div>
        <div className="h-[2px] bg-[#242723] rounded-[2px] overflow-hidden">
          <div
            className="h-full bg-[#00ff66] rounded-[2px] transition-[width] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
