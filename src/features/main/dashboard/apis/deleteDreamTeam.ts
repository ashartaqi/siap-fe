import axiosClient from "@/lib/axiosClient";

export const deleteDreamTeam = async (): Promise<void> => {
  await axiosClient.delete("/dream-team");
};
