import { useInfiniteQuery } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IPlayersResponse, IPlayersPayload } from "../types";
import { getPlayers } from "../apis/getPlayers";

const useInfinitePlayers = (payload: IPlayersPayload) => {
  return useInfiniteQuery<IPlayersResponse[], TAxiosError>({
    queryKey: ["players", "infinite", payload],
    queryFn: ({ pageParam = 0 }) =>
      getPlayers({ ...payload, skip: pageParam as number, limit: 50 }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 50) return undefined;
      return allPages.flat().length;
    },
    initialPageParam: 0,
  });
};

export { useInfinitePlayers };
