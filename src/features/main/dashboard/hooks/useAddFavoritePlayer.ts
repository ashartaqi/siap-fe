import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavoritePlayer } from "../apis/addFavoritePlayer";

export const useAddFavoritePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: number) => addFavoritePlayer(playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players", "fav"] });
    },
  });
};
