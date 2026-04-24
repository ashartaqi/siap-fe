import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IDreamTeamResponse } from "../types";
import { updateDreamTeamSlot } from "../apis/updateDreamTeamSlot";

const useUpdateDreamTeamSlot = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IDreamTeamResponse,
    TAxiosError,
    { slot_id: number; player_id: number }
  >({
    mutationFn: (payload) =>
      updateDreamTeamSlot(payload.slot_id, payload.player_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dream-team"] });
    },
  });
};

export { useUpdateDreamTeamSlot };
