import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IVotePayload, IVoteResponse } from "../types";
import { createVote } from "../apis/createVote";

const useCreateVote = () => {
  const queryClient = useQueryClient();

  return useMutation<IVoteResponse, TAxiosError, IVotePayload>({
    mutationFn: (payload) => createVote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-votes"] });
      queryClient.invalidateQueries({ queryKey: ["fixture-votes"] });
    },
  });
};

export { useCreateVote };
