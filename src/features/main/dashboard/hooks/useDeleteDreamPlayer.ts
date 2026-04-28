import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { deleteDreamPlayer } from "../apis/deleteDreamPlayer";

const useDeleteDreamPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation<void, TAxiosError, void>({
    mutationFn: deleteDreamPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-player"] });
    },
  });
};

export { useDeleteDreamPlayer };
