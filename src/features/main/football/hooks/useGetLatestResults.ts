import { useQueries } from "@tanstack/react-query";
import { Match } from "@/types/football";
import { FIXTURE_LEAGUES } from "@/lib/constants";
import { getFixtures } from "../apis/getFixtures";

const useGetLatestResults = () => {
  const targetStatuses = ["FINISHED", "AWARDED"];

  const results = useQueries({
    queries: FIXTURE_LEAGUES.flatMap((lg) =>
      targetStatuses.map((status) => ({
        queryKey: ["fixtures", lg.key, status],
        queryFn: async () => {
          const now = new Date();
          const data = await getFixtures({
            league: lg.key,
            status_filter: status,
            limit: 50,
          });
          return data
            .filter((m) => new Date(m.date ?? "") <= now)
            .map((m) => ({ ...m, league: lg.key }));
        },
      })),
    ),
  });

  const isLoading = results.some((r) => r.isLoading);
  const data: Match[] = results
    .flatMap((r) => r.data ?? [])
    .sort(
      (a, b) =>
        new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
    )
    .slice(0, 10);

  return { data, isLoading };
};

export { useGetLatestResults };
