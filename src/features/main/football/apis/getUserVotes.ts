import axiosClient from "@/lib/axiosClient";
import { IVoteResponse } from "../types";

export const getUserVotes = async (): Promise<IVoteResponse[]> => {
  const res = await axiosClient.get<IVoteResponse[]>("/votes/my-votes");
  return res.data;
};
