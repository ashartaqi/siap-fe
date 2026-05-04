import { useQuery } from "@tanstack/react-query";
import { getMatchPrediction } from "../apis/getMatchPrediction";

export const useGetMatchPrediction = (
  team1_name?: string,
  team2_name?: string,
) => {
  return useQuery({
    queryKey: ["matchPrediction", team1_name, team2_name],
    queryFn: () => getMatchPrediction(team1_name!, team2_name!),
    enabled: !!team1_name && !!team2_name,
    staleTime: Infinity,
  });
};
