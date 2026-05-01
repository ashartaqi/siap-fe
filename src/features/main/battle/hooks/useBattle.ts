import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBattleUsers,
  getUserDreamTeam,
  getUserCustomPlayer,
  simulateTeamBattle,
  simulatePlayerBattle,
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

export const useSimulateTeamBattle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (opponentId: number) => simulateTeamBattle(opponentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
    },
  });
};

export const useSimulatePlayerBattle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (opponentId: number) => simulatePlayerBattle(opponentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
    },
  });
};
