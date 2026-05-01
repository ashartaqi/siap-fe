import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axiosClient";

export const useUnlockPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playerId: number) => {
      const response = await axiosClient.post(`/shop/unlock/${playerId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
      queryClient.invalidateQueries({ queryKey: ["infinite-players"] });
    },
  });
};
