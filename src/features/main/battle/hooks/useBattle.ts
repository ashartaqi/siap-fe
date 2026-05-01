import { useQuery } from "@tanstack/react-query";
import {
  getBattleUsers,
  getUserDreamTeam,
  getUserCustomPlayer,
} from "../apis/battle";

export const useGetBattleUsers = () => {
  return useQuery({
    queryKey: ["battle-users"],
    queryFn: getBattleUsers,
  });
};

export const useGetUserDreamTeam = (userId: number | null) => {
  return useQuery({
    queryKey: ["user-dream-team", userId],
    queryFn: () => getUserDreamTeam(userId!),
    enabled: !!userId,
  });
};

export const useGetUserCustomPlayer = (userId: number | null) => {
  return useQuery({
    queryKey: ["user-custom-player", userId],
    queryFn: () => getUserCustomPlayer(userId!),
    enabled: !!userId,
  });
};
