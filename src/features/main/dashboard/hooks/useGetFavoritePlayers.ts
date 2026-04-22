import { useQuery } from "@tanstack/react-query";
import type { Player } from "@/types/football";
import { getFavoritePlayers } from "../apis/getFavoritePlayers";

export const useGetFavoritePlayers = () => {
  return useQuery<Player[]>({
    queryKey: ["players", "fav"],
    queryFn: getFavoritePlayers,
    retry: false,
  });
};
