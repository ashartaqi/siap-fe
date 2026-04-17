import axiosClient from "@/lib/axiosClient";
import { IDreamPlayerPayload, IDreamPlayerResponse } from "../types";

export const createDreamPlayer = async (
  payload: IDreamPlayerPayload,
): Promise<IDreamPlayerResponse> => {
  const res = await axiosClient.post<IDreamPlayerResponse>(
    "/custom-player",
    payload,
  );
  return res.data;
};
