import axiosClient from "@/lib/axiosClient";

export const toggleFavoritePlayer = async (playerId: number): Promise<void> => {
  await axiosClient.post(`/players/fav/${playerId}`);
};
