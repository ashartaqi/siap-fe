import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../apis/getTeams";
import { ITeamsResponse } from "../types";

export const useGetTeamByName = (name: string) => {
  return useQuery<ITeamsResponse | null>({
    queryKey: ["teams", "search", name],
    queryFn: async () => {
      const teams = await getTeams({ name, limit: 1 });
      return teams[0] || null;
    },
    enabled: !!name,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
