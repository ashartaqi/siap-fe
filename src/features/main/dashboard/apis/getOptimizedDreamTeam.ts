import axiosClient from "@/lib/axiosClient";
import { IDreamTeamResponse } from "../types";

export const getOptimizedDreamTeam = async (
  formation: string,
): Promise<IDreamTeamResponse> => {
  const res = await axiosClient.get<IDreamTeamResponse>(
    `/dream-team/${formation}`,
  );
  return res.data;
};
