import { useQuery } from "@tanstack/react-query";
import type { Club } from "@/types/football";
import { getFavoriteTeam } from "../apis/getFavoriteTeam";

export const useGetFavoriteTeam = () => {
  return useQuery<Club[]>({
    queryKey: ["teams", "fav"],
    queryFn: getFavoriteTeam,
    retry: false,
  });
};
