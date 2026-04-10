import { useQuery } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IDreamPlayerResponse } from "../types";
import { getDreamPlayer } from "../apis/getDreamPlayer";

const useGetDreamPlayers = () => {
  return useQuery<IDreamPlayerResponse, TAxiosError>({
    queryKey: ["custom-player"],
    queryFn: () => getDreamPlayer(),
  });
};

export { useGetDreamPlayers };
