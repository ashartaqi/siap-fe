import { useInfiniteQuery } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IPlayersResponse, IPlayersPayload } from "../types";
import { getPlayers } from "../apis/getPlayers";

const useInfinitePlayers = (payload: IPlayersPayload, limit: number = 50) => {
  return useInfiniteQuery<IPlayersResponse[], TAxiosError>({
    queryKey: ["players", "infinite", payload, limit],
    queryFn: ({ pageParam = 0 }) =>
      getPlayers({ ...payload, skip: pageParam as number, limit }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.flat().length;
    },
    initialPageParam: 0,
  });
};

export { useInfinitePlayers };
