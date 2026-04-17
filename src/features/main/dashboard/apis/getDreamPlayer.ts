import axiosClient from "@/lib/axiosClient";
import { IDreamPlayerResponse } from "../types";

export const getDreamPlayer = async (): Promise<IDreamPlayerResponse> => {
  const res = await axiosClient.get<IDreamPlayerResponse>("/custom-player");
  return res.data;
};
