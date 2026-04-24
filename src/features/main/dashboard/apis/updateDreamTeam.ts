import axiosClient from "@/lib/axiosClient";
import { IDreamTeamPayload, IDreamTeamResponse } from "../types";

export const updateDreamTeam = async (
  payload: IDreamTeamPayload,
): Promise<IDreamTeamResponse> => {
  const res = await axiosClient.put<IDreamTeamResponse>("/dream-team", payload);
  return res.data;
};
