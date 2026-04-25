import { useQuery } from "@tanstack/react-query";
import { getDreamTeam } from "../apis/getDreamTeam";
import { IDreamTeamResponse } from "../types";
import { TAxiosError } from "@/types/api";

const useGetDreamTeam = () => {
  return useQuery<IDreamTeamResponse, TAxiosError>({
    queryKey: ["dream-team"],
    queryFn: getDreamTeam,
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

export { useGetDreamTeam };
