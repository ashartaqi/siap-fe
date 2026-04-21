import { useQuery } from "@tanstack/react-query";
import { IPlayerAttributes } from "../types";
import { getPlayerAttributes } from "../apis/getPlayerAttributes";

const useGetPlayerAttributes = (enabled = true) => {
  return useQuery<IPlayerAttributes, Error>({
    queryKey: ["player-attributes"],
    queryFn: getPlayerAttributes,
    enabled,
  });
};

export { useGetPlayerAttributes };
