import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { deleteVote } from "../apis/deleteVote";

const useDeleteVote = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, TAxiosError, number | undefined>({
    mutationFn: (voteId) => deleteVote(voteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-votes"] });
      queryClient.invalidateQueries({ queryKey: ["fixture-votes"] });
    },
  });
};

export { useDeleteVote };
