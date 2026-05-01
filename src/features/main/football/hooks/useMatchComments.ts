import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMatchComments, sendMatchComment } from "../apis/matchComments";

export const useGetMatchComments = (matchId: number | string) => {
  return useQuery({
    queryKey: ["match-comments", matchId],
    queryFn: () => getMatchComments(matchId),
    enabled: !!matchId,
    refetchInterval: 5000,
  });
};

export const useSendMatchComment = (matchId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => sendMatchComment(matchId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-comments", matchId] });
    },
  });
};
