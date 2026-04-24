import axiosClient from "@/lib/axiosClient";
import { IDreamTeamResponse } from "../types";

export const updateDreamTeamSlot = async (
  slot_id: number,
  player_id: number,
): Promise<IDreamTeamResponse> => {
  const res = await axiosClient.patch<IDreamTeamResponse>(
    `/dream-team/slot/${slot_id}`,
    { player_id },
  );
  return res.data;
};
