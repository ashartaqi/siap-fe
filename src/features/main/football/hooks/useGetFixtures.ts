import { useQuery } from "@tanstack/react-query";
import { Match } from "@/features/main/football/types";
import { IFixturesPayload } from "../types";
import { getFixtures } from "../apis/getFixtures";

const useGetFixtures = (payload: IFixturesPayload, enabled = true) => {
  return useQuery<Match[], Error>({
    queryKey: ["fixtures", payload],
    queryFn: () => getFixtures(payload),
    enabled,
  });
};

export { useGetFixtures };
