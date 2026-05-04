import { useQuery } from "@tanstack/react-query";
import { Match } from "@/features/main/football/types";
import { getFixtures } from "../apis/getFixtures";

const useGetLatestResults = () => {
  const { data = [], isLoading } = useQuery<Match[]>({
    queryKey: ["fixtures", "FINISHED"],
    queryFn: () => getFixtures({ status_filter: "FINISHED", limit: 14 }),
  });

  const results = [...data].sort(
    (a, b) =>
      new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
  );

  return { data: results, isLoading };
};

export { useGetLatestResults };
