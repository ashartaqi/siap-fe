import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IDreamPlayerPayload, IDreamPlayerResponse } from "../types";
import { updateDreamPlayer } from "../apis/updateDreamPlayer";

const useUpdateDreamPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation<IDreamPlayerResponse, TAxiosError, IDreamPlayerPayload>({
    mutationFn: (payload) => updateDreamPlayer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-player"] });
    },
  });
};

export { useUpdateDreamPlayer };
