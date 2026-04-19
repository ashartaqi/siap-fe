import axiosClient from "@/lib/axiosClient";
import { IDreamPlayerPayload, IDreamPlayerResponse } from "../types";

export const updateDreamPlayer = async (
  payload: IDreamPlayerPayload,
): Promise<IDreamPlayerResponse> => {
  const res = await axiosClient.patch<IDreamPlayerResponse>(
    "/custom-player",
    payload,
  );
  return res.data;
};
