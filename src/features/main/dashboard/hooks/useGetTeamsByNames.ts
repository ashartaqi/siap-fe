import { useQuery } from "@tanstack/react-query";
import { ITeamsResponse } from "../types";
import { getTeams } from "../apis/getTeams";

export const useGetTeamsByNames = (names: string[]) => {
  const unique = [...new Set(names.filter(Boolean))].sort();

  return useQuery<Record<string, ITeamsResponse>>({
    queryKey: ["teams", "batch", unique.join(",")],
    queryFn: async () => {
      const teams = await getTeams({ names: unique, limit: unique.length });
      return Object.fromEntries(teams.map((t) => [t.name, t]));
    },
    enabled: unique.length > 0,
    staleTime: 1000 * 60 * 60,
  });
};
