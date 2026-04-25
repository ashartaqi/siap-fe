import axiosClient from "@/lib/axiosClient";

export const removeFavoriteTeam = async (teamId: number) => {
  const res = await axiosClient.delete("/teams/fav", {
    params: { team: teamId },
  });
  return res.data;
};
