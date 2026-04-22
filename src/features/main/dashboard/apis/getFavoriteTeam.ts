import axiosClient from "@/lib/axiosClient";
import type { Club } from "@/types/football";

export const getFavoriteTeam = async (): Promise<Club[]> => {
  const res = await axiosClient.get<Club[]>("/teams/fav");
  return res.data;
};
