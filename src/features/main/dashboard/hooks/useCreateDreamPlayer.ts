import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IDreamPlayerPayload, IDreamPlayerResponse } from "../types";
import { createDreamPlayer } from "../apis/createDreamPlayer";

const useCreateDreamPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation<IDreamPlayerResponse, TAxiosError, IDreamPlayerPayload>({
    mutationFn: (payload) => createDreamPlayer(payload),
    onSuccess: () => {
      // Invalidate the GET query so the list refreshes automatically
      queryClient.invalidateQueries({ queryKey: ["custom-player"] });
    },
  });
};

export { useCreateDreamPlayer };
