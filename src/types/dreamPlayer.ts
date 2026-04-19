import type {
  IPlayersResponse,
  IGoalKeeperResponse,
} from "@/features/main/dashboard/types";

export type StatKey =
  | "pace"
  | "shooting"
  | "passing"
  | "dribbling"
  | "defending"
  | "physic";

export interface PlayerIdentity {
  name: string;
  position: string;
  nationality: string;
  shirt_number: number;
  preferred_foot: "Left" | "Right";
}

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
}

export type SlotPlayers = Record<
  StatKey,
  IPlayersResponse | IGoalKeeperResponse | undefined
>;

export interface PageState {
  identity: PlayerIdentity;
  stats: PlayerStats;
  mode: "view" | "edit";
}
