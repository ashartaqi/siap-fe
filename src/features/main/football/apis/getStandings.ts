import axiosClient from "@/lib/axiosClient";
import { StandingRow } from "@/features/main/football/types";

export const getStandings = async (
  league: string,
  limit = 20,
): Promise<StandingRow[]> => {
  const res = await axiosClient.get<StandingRow[]>("/live/standings", {
    params: { league, limit },
  });
  return Array.isArray(res.data) ? res.data : [];
};
