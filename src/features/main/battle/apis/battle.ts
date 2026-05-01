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

export interface IMatchSimulationStats {
  shots1: number;
  shots2: number;
  xg1: number;
  xg2: number;
  possession1: number;
  possession2: number;
}

export interface IMatchSimulationResult {
  score1: number;
  score2: number;
  stats: IMatchSimulationStats;
  log: string[];
  winner: "me" | "opponent" | "draw";
  reward: number;
  new_balance: number;
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

export async function simulateBattle(
  opponentId: number,
): Promise<IMatchSimulationResult> {
  const response = await axiosClient.post(`/battle/simulate/${opponentId}`);
  return response.data;
}
