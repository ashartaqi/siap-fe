import axiosClient from "@/lib/axiosClient";
import { Match } from "@/features/main/football/types";
import { IFixturesPayload } from "../types";

export const getFixtures = async (
  payload: IFixturesPayload,
): Promise<Match[]> => {
  const params: Record<string, string | number> = {};
  if (payload.league) params.league = payload.league;
  if (payload.limit !== undefined) params.limit = payload.limit;
  if (payload.status_filter) params.status_filter = payload.status_filter;
  if (payload.home_team) params.home_team = payload.home_team;
  if (payload.away_team) params.away_team = payload.away_team;

  const res = await axiosClient.get<Match[]>("/live/fixtures", { params });
  return res.data;
};
