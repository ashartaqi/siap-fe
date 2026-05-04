import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getBattleUsers,
  getUserDreamTeam,
  getUserCustomPlayer,
  simulateTeamBattle,
  simulatePlayerBattle,
} from "../apis/battle";
import { useRewards } from "@/components/providers/RewardProvider";

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
  return useMutation({
    mutationFn: (opponentId: number) => simulateTeamBattle(opponentId),
  });
};

export const useSimulatePlayerBattle = () => {
  return useMutation({
    mutationFn: (opponentId: number) => simulatePlayerBattle(opponentId),
  });
};
