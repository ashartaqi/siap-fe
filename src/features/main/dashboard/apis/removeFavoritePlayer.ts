import axiosClient from "@/lib/axiosClient";

export const removeFavoritePlayer = async (playerId: number): Promise<void> => {
  await axiosClient.delete("/players/fav", { params: { player: playerId } });
};
