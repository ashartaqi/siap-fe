import type {
  IPlayersResponse,
  IGoalKeeperResponse,
} from "@/features/main/dashboard/types";

export interface Formation {
  id: string;
  label: string;
  description: string;
  tacticalFit: string;
  rows: string[][];
}

export type SelectedPlayers = Record<
  string,
  IPlayersResponse | IGoalKeeperResponse | undefined
>;
