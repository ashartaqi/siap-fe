import axiosClient from "@/lib/axiosClient";

export interface MatchComment {
  id: number;
  user_id: number;
  match_id: number;
  username: string;
  content: string;
  created_at: string;
}

export async function getMatchComments(
  matchId: number | string,
): Promise<MatchComment[]> {
  const response = await axiosClient.get(`/match-comments/${matchId}`);
  return response.data;
}

export async function sendMatchComment(
  matchId: number | string,
  content: string,
): Promise<MatchComment> {
  const response = await axiosClient.post(`/match-comments/${matchId}`, {
    content,
  });
  return response.data;
}
