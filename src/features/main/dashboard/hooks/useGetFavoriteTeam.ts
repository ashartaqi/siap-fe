import { useQuery } from "@tanstack/react-query";
import type { Club } from "@/features/main/football/types";
import { getFavoriteTeam } from "../apis/getFavoriteTeam";

export const useGetFavoriteTeam = () => {
  return useQuery<Club[]>({
    queryKey: ["teams", "fav"],
    queryFn: getFavoriteTeam,
    retry: false,
  });
};
