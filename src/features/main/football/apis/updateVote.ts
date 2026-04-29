import axiosClient from "@/lib/axiosClient";
import { IVotePayload, IVoteResponse } from "../types";

export const updateVote = async (
  payload: IVotePayload,
): Promise<IVoteResponse> => {
  const res = await axiosClient.put<IVoteResponse>("/votes", payload);
  return res.data;
};
