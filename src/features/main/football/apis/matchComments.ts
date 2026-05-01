import axiosClient from "@/lib/axiosClient";
import { MatchComment } from "../types";

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
