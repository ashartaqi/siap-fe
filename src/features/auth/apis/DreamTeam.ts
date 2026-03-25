// src/features/auth/apis/register.ts
import axiosClient from "@/lib/axiosClient";
import { IPlayersPayload, IPlayersResponse } from "../types";

export const DreamTeam = async (
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
  };

  const res = await axiosClient.post<IPlayersResponse[]>(
    "/players/getPlayers",
    null,
    { params },
  );
  return res.data;
};
