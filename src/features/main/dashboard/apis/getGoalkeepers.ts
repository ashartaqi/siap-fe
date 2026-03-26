import axiosClient from "@/lib/axiosClient";
import { IGoalKeeperResponse, IGoalKeeperPayload } from "../types";

export const getGoalkeepers = async (
  payload: IGoalKeeperPayload,
): Promise<IGoalKeeperResponse[]> => {
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
  };

  const res = await axiosClient.get<IGoalKeeperResponse[]>("/goalkeepers", {
    params,
  });
  return res.data;
};
