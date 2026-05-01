import axiosClient from "@/lib/axiosClient";
import { IVoteWithUser } from "../types";

export const getFixtureVotes = async (
  fixtureId: number,
): Promise<IVoteWithUser[]> => {
  const res = await axiosClient.get<IVoteWithUser[]>("/votes/all-votes", {
    params: { fixture_id: fixtureId },
  });
  return res.data;
};
