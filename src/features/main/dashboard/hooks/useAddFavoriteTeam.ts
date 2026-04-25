import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavoriteTeam } from "../apis/addFavoriteTeam";

export const useAddFavoriteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFavoriteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", "fav"] });
    },
  });
};
