import axiosClient from "@/lib/axiosClient";
import type { IPlayersResponse } from "@/features/main/dashboard/types";

export const getFavoritePlayers = async (): Promise<IPlayersResponse[]> => {
  const res = await axiosClient.get<IPlayersResponse[]>("/players/fav");
  return res.data;
};
