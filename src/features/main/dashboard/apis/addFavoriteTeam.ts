import axiosClient from "@/lib/axiosClient";

export const addFavoriteTeam = async (teamId: number) => {
  const res = await axiosClient.post("/teams/fav", null, {
    params: { team: teamId },
  });
  return res.data;
};
