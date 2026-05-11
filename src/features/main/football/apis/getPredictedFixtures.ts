import axiosClient from "@/lib/axiosClient";
import { Match } from "@/features/main/football/types";

export const getPredictedFixtures = async (limit = 25): Promise<Match[]> => {
  const res = await axiosClient.get<Match[]>("/live/predict", {
    params: { limit },
  });
  return res.data;
};
