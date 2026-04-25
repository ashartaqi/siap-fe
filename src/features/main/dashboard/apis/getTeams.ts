import axiosClient from "@/lib/axiosClient";
import { ITeamsPayload, ITeamsResponse } from "../types";

export const getTeams = async (
  payload: ITeamsPayload,
): Promise<ITeamsResponse[]> => {
  const params = {
    limit: payload.limit,
    name: payload.name,
    league_name: payload.leagueName,
    nationality_name: payload.nationalityName,
    min_overall: payload.minOverall,
    max_overall: payload.maxOverall,
    min_attack: payload.minAttack,
    min_midfield: payload.minMidfield,
    min_defence: payload.minDefence,
    team_type: payload.teamType,
    skip: payload.skip,
  };

  const res = await axiosClient.get<ITeamsResponse[]>("/teams", { params });
  return res.data;
};
