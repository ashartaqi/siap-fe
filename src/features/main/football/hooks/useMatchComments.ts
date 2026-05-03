import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMatchComments, sendMatchComment } from "../apis/matchComments";
import { useRewards } from "@/components/providers/RewardProvider";

export const useGetMatchComments = (matchId: number | string) => {
  return useQuery({
    queryKey: ["match-comments", matchId],
    queryFn: () => getMatchComments(matchId),
    enabled: !!matchId,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
};

export const useSendMatchComment = (matchId: number | string) => {
  const queryClient = useQueryClient();
  const { addReward } = useRewards();

  return useMutation({
    mutationFn: (content: string) => sendMatchComment(matchId, content),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["match-comments", matchId] });
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
      if (data.reward_amount) {
        addReward(data.reward_amount, "Match Analysis Contribution Reward");
      }
    },
  });
};
