import { useQueries } from "@tanstack/react-query";
import { Match } from "@/features/main/football/types";
import { getFixtures } from "../apis/getFixtures";

export const useGetTeamRecentMatches = (teamName: string | undefined) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["fixtures", "home", teamName, "FINISHED"],
        queryFn: () =>
          getFixtures({
            home_team: teamName!,
            status_filter: "FINISHED",
            limit: 5,
          }),
        enabled: !!teamName,
      },
      {
        queryKey: ["fixtures", "away", teamName, "FINISHED"],
        queryFn: () =>
          getFixtures({
            away_team: teamName!,
            status_filter: "FINISHED",
            limit: 5,
          }),
        enabled: !!teamName,
      },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);
  const data: Match[] = results.flatMap((r) => r.data ?? []);
  return { data, isLoading };
};

export const useGetTeamUpcomingFixtures = (
  teamName: string | undefined,
  limit = 3,
) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["fixtures", "home", teamName, "SCHEDULED"],
        queryFn: () =>
          getFixtures({
            home_team: teamName!,
            status_filter: "SCHEDULED",
            limit: 5,
          }),
        enabled: !!teamName,
      },
      {
        queryKey: ["fixtures", "away", teamName, "SCHEDULED"],
        queryFn: () =>
          getFixtures({
            away_team: teamName!,
            status_filter: "SCHEDULED",
            limit: 5,
          }),
        enabled: !!teamName,
      },
      {
        queryKey: ["fixtures", "home", teamName, "TIMED"],
        queryFn: () =>
          getFixtures({
            home_team: teamName!,
            status_filter: "TIMED",
            limit: 5,
          }),
        enabled: !!teamName,
      },
      {
        queryKey: ["fixtures", "away", teamName, "TIMED"],
        queryFn: () =>
          getFixtures({
            away_team: teamName!,
            status_filter: "TIMED",
            limit: 5,
          }),
        enabled: !!teamName,
      },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);
  const data: Match[] = results
    .flatMap((r) => r.data ?? [])
    .filter((m) => new Date(m.date ?? "") > new Date())
    .sort(
      (a, b) =>
        new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime(),
    )
    .slice(0, limit);

  return { data, isLoading };
};
