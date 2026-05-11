import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChatMessages } from "../apis/getChatMessages";
import { sendChatMessage } from "../apis/sendChatMessage";

export const useGetChatMessages = () => {
  return useQuery({
    queryKey: ["chat-messages"],
    queryFn: getChatMessages,
    refetchInterval: 1500,
    refetchIntervalInBackground: false,
  });
};

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
    },
  });
};
