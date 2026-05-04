import { useMutation } from "@tanstack/react-query";
import { getOptimizedDreamTeam } from "../apis/getOptimizedDreamTeam";
import { IDreamTeamResponse } from "../types";
import { TAxiosError } from "@/types/api";

const useGetOptimizedDreamTeam = () => {
  return useMutation<IDreamTeamResponse, TAxiosError, string>({
    mutationFn: (formation: string) => getOptimizedDreamTeam(formation),
  });
};

export { useGetOptimizedDreamTeam };
