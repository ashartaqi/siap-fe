import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axiosClient";
import { TAxiosError } from "@/types/api";

export interface IShopUnlockResponse {
  message: string;
  new_balance: number;
}

export const useUnlockPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation<IShopUnlockResponse, TAxiosError, number>({
    mutationFn: async (playerId: number) => {
      const response = await axiosClient.post(`/shop/unlock/${playerId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};
