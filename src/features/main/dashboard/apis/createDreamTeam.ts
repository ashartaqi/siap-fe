import axiosClient from "@/lib/axiosClient";
import { IDreamTeamPayload, IDreamTeamResponse } from "../types";

export const createDreamTeam = async (
  payload: IDreamTeamPayload,
): Promise<IDreamTeamResponse> => {
  const res = await axiosClient.post<IDreamTeamResponse>(
    "/dream-team",
    payload,
  );
  return res.data;
};
