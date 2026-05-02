import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavoritePlayer } from "../apis/toggleFavoritePlayer";

export const useToggleFavoritePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleFavoritePlayer,
    onSuccess: () => {
      // Invalidate both favourite list and general players queries
      queryClient.invalidateQueries({ queryKey: ["players", "fav"] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};
