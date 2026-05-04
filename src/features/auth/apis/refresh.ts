import axios from "axios";
import { ILoginResponse } from "../types";

export const refreshTokens = async (): Promise<ILoginResponse> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/refresh`,
    {},
    { withCredentials: true },
  );
  return response.data;
};
