import { useQueries } from "@tanstack/react-query";
import { Match } from "@/types/football";
import { FIXTURE_LEAGUES } from "@/lib/constants";
import { getFixtures } from "../apis/getFixtures";

const useGetUpcomingFixtures = () => {
  const targetStatuses = ["TIMED", "SCHEDULED", "POSTPONED"];

  const results = useQueries({
    queries: FIXTURE_LEAGUES.flatMap((lg) =>
      targetStatuses.map((status) => ({
        queryKey: ["fixtures", lg.key, status],
        queryFn: async () => {
          const now = new Date();
          const data = await getFixtures({
            league: lg.key,
            status_filter: status,
            limit: 10,
          });
          return data
            .filter((m) => new Date(m.date ?? "") > now)
            .map((m) => ({ ...m, league: lg.key }));
        },
      })),
    ),
  });

  const isLoading = results.some((r) => r.isLoading);
  const data: Match[] = results
    .flatMap((r) => r.data ?? [])
    .sort((a, b) => {
      const aLive = ["IN_PLAY", "PAUSED", "HALFTIME"].includes(a.status)
        ? 0
        : 1;
      const bLive = ["IN_PLAY", "PAUSED", "HALFTIME"].includes(b.status)
        ? 0
        : 1;
      if (aLive !== bLive) return aLive - bLive;
      return (
        new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime()
      );
    })
    .slice(0, 11);

  return { data, isLoading };
};

export { useGetUpcomingFixtures };
