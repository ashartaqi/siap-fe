import axiosClient from "@/lib/axiosClient";
import { IPlayerAttributes } from "../types";

export const getPlayerAttributes = async (): Promise<IPlayerAttributes> => {
  const [
    positionsRes,
    feetRes,
    statMinRes,
    statMaxRes,
    totalStatsRes,
    allPositionsRes,
    statFieldRes,
    defaultIdentityRes,
    defaultStatsRes,
  ] = await Promise.all([
    axiosClient.get<Record<string, string[]>>("/player-att/player-pos"),
    axiosClient.get<string[]>("/player-att/preferred-feet"),
    axiosClient.get<number>("/player-att/stat-min"),
    axiosClient.get<number>("/player-att/stat-max"),
    axiosClient.get<number>("/player-att/total-stats"),
    axiosClient.get<string[]>("/player-att/all-positions"),
    axiosClient.get<Record<string, string>>("/player-att/stat-field"),
    axiosClient.get<IPlayerAttributes["default_identity"]>(
      "/player-att/default-identity",
    ),
    axiosClient.get<Record<string, number>>("/player-att/default-stats"),
  ]);

  return {
    valid_player_positions: positionsRes.data ?? {},
    valid_preferred_feet: Array.isArray(feetRes.data) ? feetRes.data : [],
    player_stat_min: Number(statMinRes.data ?? 1),
    player_stat_max: Number(statMaxRes.data ?? 99),
    player_total_stats_max: Number(totalStatsRes.data ?? 570),
    all_positions: Array.isArray(allPositionsRes.data)
      ? allPositionsRes.data
      : [],
    stat_field_map: statFieldRes.data ?? {},
    default_identity: defaultIdentityRes.data ?? {
      name: "Your Player",
      position: "ST",
      nationality: "---",
      shirt_number: 7,
      preferred_foot: "Right",
    },
    default_stats: defaultStatsRes.data ?? {
      pace: 0,
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      physic: 0,
    },
  };
};
