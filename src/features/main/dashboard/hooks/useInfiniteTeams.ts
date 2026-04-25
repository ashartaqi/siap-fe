import { useInfiniteQuery } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { ITeamsResponse, ITeamsPayload } from "../types";
import { getTeams } from "../apis/getTeams";

const useInfiniteTeams = (payload: ITeamsPayload, limit: number = 50) => {
  return useInfiniteQuery<ITeamsResponse[], TAxiosError>({
    queryKey: ["teams", "infinite", payload, limit],
    queryFn: ({ pageParam = 0 }) =>
      getTeams({ ...payload, skip: pageParam as number, limit }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.flat().length;
    },
    initialPageParam: 0,
  });
};

export { useInfiniteTeams };
