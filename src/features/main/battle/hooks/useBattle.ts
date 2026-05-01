import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBattleUsers,
  getUserDreamTeam,
  getUserCustomPlayer,
  simulateBattle,
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

export const useSimulateBattle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (opponentId: number) => simulateBattle(opponentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
    },
  });
};
