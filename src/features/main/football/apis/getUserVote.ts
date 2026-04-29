import axiosClient from "@/lib/axiosClient";
import { IVoteResponse } from "../types";

export const getUserVote = async (): Promise<IVoteResponse | null> => {
  const res = await axiosClient.get<IVoteResponse | null>("/votes");
  return res.data;
};
