import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFavoritePlayer } from "../apis/removeFavoritePlayer";

export const useRemoveFavoritePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: number) => removeFavoritePlayer(playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players", "fav"] });
    },
  });
};
