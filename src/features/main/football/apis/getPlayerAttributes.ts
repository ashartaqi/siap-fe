import axiosClient from "@/lib/axiosClient";
import { IPlayerAttributes } from "../types";

export const getPlayerAttributes = async (): Promise<IPlayerAttributes> => {
  const [positionsRes, feetRes, statsLimitsRes] = await Promise.all([
    axiosClient.get<Record<string, string[]>>("/players/positions"),
    axiosClient.get<string[]>("/players/preferred-feet"),
    axiosClient.get<{ total: number; min: number; max: number }>(
      "/players/stats-limits",
    ),
  ]);

  const validPositions = positionsRes.data ?? {};
  const allPositions = Object.values(validPositions).flat();

  return {
    valid_player_positions: validPositions,
    valid_preferred_feet: Array.isArray(feetRes.data) ? feetRes.data : [],
    player_stat_min: Number(statsLimitsRes.data?.min ?? 1),
    player_stat_max: Number(statsLimitsRes.data?.max ?? 99),
    player_total_stats_max: Number(statsLimitsRes.data?.total ?? 570),
    all_positions: allPositions,
    stat_field_map: {
      pace: "pace",
      shooting: "shooting",
      passing: "passing",
      dribbling: "dribbling",
      defending: "defending",
      physic: "physic",
    },
    default_identity: {
      name: "Your Player",
      position: "ST",
      nationality: "---",
      shirt_number: 7,
      preferred_foot: "Right",
    },
    default_stats: {
      pace: 50,
      shooting: 50,
      passing: 50,
      dribbling: 50,
      defending: 50,
      physic: 50,
    },
  };
};
