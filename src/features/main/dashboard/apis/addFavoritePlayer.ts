import axiosClient from "@/lib/axiosClient";

export const addFavoritePlayer = async (playerId: number): Promise<void> => {
  await axiosClient.post("/players/fav", null, {
    params: { player: playerId },
  });
};
