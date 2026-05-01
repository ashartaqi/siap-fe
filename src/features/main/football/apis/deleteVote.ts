import axiosClient from "@/lib/axiosClient";

export const deleteVote = async (
  voteId?: number,
): Promise<{ success: boolean }> => {
  const params: Record<string, number> = {};
  if (voteId !== undefined) params.vote_id = voteId;
  const res = await axiosClient.delete<{ success: boolean }>("/votes", {
    params,
  });
  return res.data;
};
