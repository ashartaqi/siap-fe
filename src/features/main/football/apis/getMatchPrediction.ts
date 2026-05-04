import axiosClient from "@/lib/axiosClient";
import { IMatchPredictionResponse } from "../types";

export const getMatchPrediction = async (
  team1_name: string,
  team2_name: string,
): Promise<IMatchPredictionResponse> => {
  const res = await axiosClient.get<IMatchPredictionResponse>("/live/predict", {
    params: { team1_name, team2_name },
  });
  return res.data;
};
