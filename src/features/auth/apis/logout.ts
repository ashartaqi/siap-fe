import axiosClient from "@/lib/axiosClient";

export const logout = async (): Promise<void> => {
  await axiosClient.post("/user/logout");
};
