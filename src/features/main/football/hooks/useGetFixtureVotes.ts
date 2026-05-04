import { useQuery } from "@tanstack/react-query";
import { getFixtureVotes } from "../apis/getFixtureVotes";

const useGetFixtureVotes = (fixtureId: number | null) => {
  return useQuery({
    queryKey: ["fixture-votes", fixtureId],
    queryFn: () => getFixtureVotes(fixtureId!),
    enabled: fixtureId !== null,
  });
};

export { useGetFixtureVotes };
