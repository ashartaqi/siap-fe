import { useQuery } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IPlayersResponse, IPlayersPayload } from "../types";
import { getPlayers } from "../apis/getPlayers";

const useGetPlayers = (payload: IPlayersPayload) => {
  return useQuery<IPlayersResponse[], TAxiosError>({
    queryKey: ["players", payload],
    queryFn: () => getPlayers(payload),
  });
};

export { useGetPlayers };
