import { useQuery } from "@tanstack/react-query";
import { StandingRow } from "@/types/football";
import { getStandings } from "../apis/getStandings";

const useGetStandings = (league: string, enabled = true) => {
  return useQuery<StandingRow[], Error>({
    queryKey: ["standings", league],
    queryFn: () => getStandings(league),
    enabled,
  });
};

export { useGetStandings };
