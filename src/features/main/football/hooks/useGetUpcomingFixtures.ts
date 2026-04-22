import { useQuery } from "@tanstack/react-query";
import { Match } from "@/types/football";
import { getFixtures } from "../apis/getFixtures";

const useGetUpcomingFixtures = () => {
  const { data = [], isLoading } = useQuery<Match[]>({
    queryKey: ["fixtures", "all"],
    queryFn: () => getFixtures({ limit: 20 }),
  });

  const now = new Date();
  const upcomingData = data
    .filter((m) => {
      const isLive = ["IN_PLAY", "PAUSED", "HALFTIME"].includes(m.status);
      const isUpcoming = ["TIMED", "SCHEDULED"].includes(m.status);
      return isLive || isUpcoming || new Date(m.date ?? "") > now;
    })
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

  return { data: upcomingData, isLoading };
};

export { useGetUpcomingFixtures };
