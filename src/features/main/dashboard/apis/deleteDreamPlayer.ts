import axiosClient from "@/lib/axiosClient";

export const deleteDreamPlayer = async (): Promise<void> => {
  await axiosClient.delete("/custom-player");
};
