import axiosClient from "@/lib/axiosClient";
import type { Player } from "@/types/football";

export const getFavoritePlayers = async (): Promise<Player[]> => {
  const res = await axiosClient.get<Player[]>("/players/fav");
  return res.data;
};
