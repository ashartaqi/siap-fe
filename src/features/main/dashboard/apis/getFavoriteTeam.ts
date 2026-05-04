import axiosClient from "@/lib/axiosClient";
import type { Club } from "@/features/main/football/types";

export const getFavoriteTeam = async (): Promise<Club[]> => {
  const res = await axiosClient.get<Club[]>("/teams/fav");
  return res.data;
};
