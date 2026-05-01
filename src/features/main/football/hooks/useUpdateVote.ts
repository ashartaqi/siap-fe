import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IVotePayload, IVoteResponse } from "../types";
import { updateVote } from "../apis/updateVote";

const useUpdateVote = () => {
  const queryClient = useQueryClient();

  return useMutation<IVoteResponse, TAxiosError, IVotePayload>({
    mutationFn: (payload) => updateVote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-votes"] });
      queryClient.invalidateQueries({ queryKey: ["fixture-votes"] });
    },
  });
};

export { useUpdateVote };
