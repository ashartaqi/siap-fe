import { useQuery } from "@tanstack/react-query";
import { Match } from "@/types/football";
import { getFixtures } from "../apis/getFixtures";

const useGetLatestResults = () => {
  const { data = [], isLoading } = useQuery<Match[]>({
    queryKey: ["fixtures", "all"],
    queryFn: () => getFixtures({ limit: 15 }),
  });

  const now = new Date();
  const results = data
    .filter(
      (m) =>
        ["FINISHED", "AWARDED"].includes(m.status) &&
        new Date(m.date ?? "") <= now,
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
    )
    .slice(0, 10);

  return { data: results, isLoading };
};

export { useGetLatestResults };
