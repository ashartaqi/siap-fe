import { useQuery } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IGoalKeeperResponse, IGoalKeeperPayload } from "../types";
import { getGoalkeepers } from "../apis/getGoalkeepers";

const useGetGoalkeepers = (payload: IGoalKeeperPayload) => {
  return useQuery<IGoalKeeperResponse[], TAxiosError>({
    queryKey: ["goalkeepers", payload],
    queryFn: () => getGoalkeepers(payload),
  });
};

export { useGetGoalkeepers };
