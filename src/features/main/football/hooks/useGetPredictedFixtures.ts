import { useQuery } from "@tanstack/react-query";
import { getPredictedFixtures } from "../apis/getPredictedFixtures";

export const useGetPredictedFixtures = (limit = 10) =>
  useQuery({
    queryKey: ["predicted-fixtures", limit],
    queryFn: () => getPredictedFixtures(limit),
  });
