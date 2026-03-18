// src/features/auth/apis/register.ts
import axiosClient from "@/lib/axiosClient";
import { IRegisterPayload, IRegisterResponse } from "../types";

export const register = async (
  data: IRegisterPayload,
): Promise<IRegisterResponse> => {
  const response = await axiosClient.post("/user/register", data);
  return response.data;
};
