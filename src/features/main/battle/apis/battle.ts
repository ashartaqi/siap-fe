import axiosClient from "@/lib/axiosClient";
import {
  IDreamTeamResponse,
  IDreamPlayerResponse,
} from "../../dashboard/types";

export interface BattleUser {
  id: number;
  username: string;
  has_team: boolean;
  has_player: boolean;
}

export async function getBattleUsers(): Promise<BattleUser[]> {
  const response = await axiosClient.get("/battle/users");
  return response.data;
}

export async function getUserDreamTeam(
  userId: number,
): Promise<IDreamTeamResponse> {
  const response = await axiosClient.get(`/battle/team/${userId}`);
  return response.data;
}

export async function getUserCustomPlayer(
  userId: number,
): Promise<IDreamPlayerResponse> {
  const response = await axiosClient.get(`/battle/player/${userId}`);
  return response.data;
}
