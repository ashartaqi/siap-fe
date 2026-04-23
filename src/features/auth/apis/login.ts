import axiosClient from "@/lib/axiosClient";
import { ILoginPayload, ILoginResponse } from "../types";

export const login = async (data: ILoginPayload): Promise<ILoginResponse> => {
  const response = await axiosClient.post("/user/login", data);
  return response.data;
};
