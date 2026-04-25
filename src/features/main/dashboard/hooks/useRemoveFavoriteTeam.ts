import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFavoriteTeam } from "../apis/removeFavoriteTeam";

export const useRemoveFavoriteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFavoriteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", "fav"] });
    },
  });
};
