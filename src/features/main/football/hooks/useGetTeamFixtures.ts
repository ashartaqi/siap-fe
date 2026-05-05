import { useQuery } from "@tanstack/react-query";
import { Match } from "@/features/main/football/types";
import { getFixtures } from "../apis/getFixtures";

export const useGetTeamRecentMatches = (teamName: string | undefined) => {
  const { data, isLoading } = useQuery({
    queryKey: ["fixtures", "team", teamName, "FINISHED"],
    queryFn: () =>
      getFixtures({ team: teamName!, status_filter: "FINISHED", limit: 10 }),
    enabled: !!teamName,
  });

  return { data: data ?? [], isLoading };
};

export const useGetTeamUpcomingFixtures = (
  teamName: string | undefined,
  limit = 3,
) => {
  const { data, isLoading } = useQuery({
    queryKey: ["fixtures", "team", teamName, "SCHEDULED,TIMED"],
    queryFn: () =>
      getFixtures({
        team: teamName!,
        status_filter: "SCHEDULED,TIMED",
        limit: 10,
      }),
    enabled: !!teamName,
  });

  const sorted: Match[] = (data ?? [])
    .filter((m) => new Date(m.date ?? "") > new Date())
    .sort(
      (a, b) =>
        new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime(),
    )
    .slice(0, limit);

  return { data: sorted, isLoading };
};
