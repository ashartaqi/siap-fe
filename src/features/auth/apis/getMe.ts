import axiosClient from "@/lib/axiosClient";

export interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export async function getMe(): Promise<UserProfile> {
  const response = await axiosClient.get("/user/me");
  return response.data;
}
