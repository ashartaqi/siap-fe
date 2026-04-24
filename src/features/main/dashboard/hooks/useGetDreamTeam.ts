import { useQuery } from "@tanstack/react-query";
import { getDreamTeam } from "../apis/getDreamTeam";
import { IDreamTeamResponse } from "../types";

const useGetDreamTeam = () => {
  return useQuery<IDreamTeamResponse>({
    queryKey: ["dream-team"],
    queryFn: getDreamTeam,
  });
};

export { useGetDreamTeam };
