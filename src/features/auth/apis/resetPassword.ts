import axiosClient from "@/lib/axiosClient";
import { IResetPasswordPayload, IResetPasswordResponse } from "../types";

export const resetPassword = async (
  data: IResetPasswordPayload,
): Promise<IResetPasswordResponse> => {
  const response = await axiosClient.post("/user/reset-password", data);
  return response.data;
};
