import { useQueries } from "@tanstack/react-query";
import { Match } from "@/features/main/football/types";
import { getFixtures } from "../apis/getFixtures";

const useGetUpcomingFixtures = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["fixtures", "SCHEDULED"],
        queryFn: () => getFixtures({ status_filter: "SCHEDULED", limit: 10 }),
      },
      {
        queryKey: ["fixtures", "TIMED"],
        queryFn: () => getFixtures({ status_filter: "TIMED", limit: 10 }),
      },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);
  const data: Match[] = results
    .flatMap((r) => r.data ?? [])
    .sort(
      (a, b) =>
        new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime(),
    );

  return { data, isLoading };
};

export { useGetUpcomingFixtures };
