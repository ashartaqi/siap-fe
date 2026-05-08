import { useQuery } from "@tanstack/react-query";
import { getFixtures } from "../apis/getFixtures";

const useGetUpcomingFixtures = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["fixtures", "SCHEDULED,TIMED"],
    queryFn: () => getFixtures({ status_filter: "SCHEDULED,TIMED", limit: 20 }),
  });

  const sorted = (data ?? []).sort(
    (a, b) =>
      new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime(),
  );

  return { data: sorted, isLoading };
};

export { useGetUpcomingFixtures };
