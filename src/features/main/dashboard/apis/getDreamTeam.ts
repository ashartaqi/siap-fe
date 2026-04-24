import axiosClient from "@/lib/axiosClient";
import { IDreamTeamResponse } from "../types";

export const getDreamTeam = async (): Promise<IDreamTeamResponse> => {
  const res = await axiosClient.get<IDreamTeamResponse>("/dream-team");
  return res.data;
};
