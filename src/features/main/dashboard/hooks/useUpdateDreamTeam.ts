import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IDreamTeamPayload, IDreamTeamResponse } from "../types";
import { updateDreamTeam } from "../apis/updateDreamTeam";

const useUpdateDreamTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<IDreamTeamResponse, TAxiosError, IDreamTeamPayload>({
    mutationFn: (payload) => updateDreamTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dream-team"] });
    },
  });
};

export { useUpdateDreamTeam };
