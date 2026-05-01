import axiosClient from "@/lib/axiosClient";
import { IPlayersPayload, IPlayersResponse } from "../types";

export const getPlayers = async (
  payload: IPlayersPayload,
): Promise<IPlayersResponse[]> => {
  const params = {
    limit: payload.limit,
    name: payload.name,
    team_id: payload.teamId,
    min_overall: payload.minOverall,
    max_overall: payload.maxOverall,
    position: payload.position,
    nationality_name: payload.nationalityName,
    min_age: payload.minAge,
    max_age: payload.maxAge,
    preferred_foot: payload.preferredFoot,
    skip: payload.skip,
    order_by_stat: payload.orderByStat,
    pace: payload.pace,
    shooting: payload.shooting,
    passing: payload.passing,
    dribbling: payload.dribbling,
    defending: payload.defending,
    physic: payload.physic,
    unlock_status: payload.unlockStatus,
  };

  const res = await axiosClient.get<IPlayersResponse[]>("/players", { params });
  return res.data;
};
