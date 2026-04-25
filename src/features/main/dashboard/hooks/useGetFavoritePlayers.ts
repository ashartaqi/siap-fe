import { useQuery } from "@tanstack/react-query";
import type { IPlayersResponse } from "../types";
import { getFavoritePlayers } from "../apis/getFavoritePlayers";

export const useGetFavoritePlayers = () => {
  return useQuery<IPlayersResponse[]>({
    queryKey: ["players", "fav"],
    queryFn: getFavoritePlayers,
    retry: false,
  });
};
