import axiosClient from "@/lib/axiosClient";
import { IShopUnlockResponse } from "../types";

export async function unlockPlayer(
  playerId: number,
): Promise<IShopUnlockResponse> {
  const response = await axiosClient.post(`/shop/unlock/${playerId}`);
  return response.data;
}
