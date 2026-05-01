import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IShopUnlockResponse } from "../types";
import { unlockPlayer } from "../apis/unlockPlayer";

export const useUnlockPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation<IShopUnlockResponse, TAxiosError, number>({
    mutationFn: unlockPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};
