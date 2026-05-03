import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChatMessages } from "../apis/getChatMessages";
import { sendChatMessage } from "../apis/sendChatMessage";
import { useRewards } from "@/components/providers/RewardProvider";

export const useGetChatMessages = () => {
  return useQuery({
    queryKey: ["chat-messages"],
    queryFn: getChatMessages,
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
  });
};

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();
  const { addReward } = useRewards();

  return useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
      if (data.reward_amount) {
        addReward(data.reward_amount, "Community Participation Reward");
      }
    },
  });
};
