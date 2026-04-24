import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { deleteDreamTeam } from "../apis/deleteDreamTeam";

const useDeleteDreamTeam = () => {
  const queryClient = useQueryClient();

  return useMutation<void, TAxiosError, void>({
    mutationFn: deleteDreamTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dream-team"] });
    },
  });
};

export { useDeleteDreamTeam };
