import axiosClient from "@/lib/axiosClient";
import { IVotePayload, IVoteResponse } from "../types";

export const createVote = async (
  payload: IVotePayload,
): Promise<IVoteResponse> => {
  const res = await axiosClient.post<IVoteResponse>("/votes", payload);
  return res.data;
};
