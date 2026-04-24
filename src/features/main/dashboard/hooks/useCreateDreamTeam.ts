import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IDreamTeamPayload, IDreamTeamResponse } from "../types";
import { createDreamTeam } from "../apis/createDreamTeam";

const useCreateDreamTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<IDreamTeamResponse, TAxiosError, IDreamTeamPayload>({
    mutationFn: (payload) => createDreamTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dream-team"] });
    },
  });
};

export { useCreateDreamTeam };
