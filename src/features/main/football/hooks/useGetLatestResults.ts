import { useQuery } from "@tanstack/react-query";
import { Match } from "@/types/football";
import { getFixtures } from "../apis/getFixtures";

const useGetLatestResults = () => {
  const { data = [], isLoading } = useQuery<Match[]>({
    queryKey: ["fixtures", "FINISHED"],
    queryFn: () => getFixtures({ status_filter: "FINISHED", limit: 10 }),
  });

  const results = [...data].sort(
    (a, b) =>
      new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
  );

  return { data: results, isLoading };
};

export { useGetLatestResults };
