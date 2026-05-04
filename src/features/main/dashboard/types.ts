export interface IShopUnlockResponse {
  message: string;
  new_balance: number;
}

export interface IPlayersPayload {
  limit?: number;
  offset?: number;
  skip?: number;
  teamId?: number;
  name?: string;
  nationalityName?: string;
  position?: string;
  minOverall?: number;
  maxOverall?: number;
  minAge?: number;
  maxAge?: number;
  preferredFoot?: string;
  orderByStat?: string;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physic?: number;
  unlockStatus?: "all" | "locked" | "unlocked";
}

export interface IPlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
}

export interface IGoalkeeperStats {
  diving: number;
  handling: number;
  kicking: number;
  positioning: number;
  reflexes: number;
  speed: number;
}

export interface IPlayersResponse {
  id: number;
  short_name: string;
  long_name: string;
  positions: string[];
  overall: number;
  age: number;
  dob: string;
  height_cm: number;
  weight_kg: number;
  club_team_id?: number | null;
  club_name?: string | null;
  nationality_name: string;
  preferred_foot: string;
  weak_foot: number;
  skill_moves: number;
  work_rate: string;
  player_stats: IPlayerStats | null;
  goalkeeper_stats: IGoalkeeperStats | null;
  player_face_url: string;
  is_unlocked?: boolean;
}

export interface IDreamPlayerPayload {
  name: string;
  nationality: string;
  shirt_number: number;
  preferred_foot: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
}

export interface IDreamPlayerResponse {
  name: string;
  position: string;
  nationality: string;
  shirt_number: number;
  preferred_foot: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
  overall?: number;
}

// What you SEND to backend — no id
export interface IDreamTeamSlot {
  position: string;
  row: number | null;
  col: number | null;
  player_id: number;
}

// What you GET BACK from backend — has id and player
export interface IDreamTeamSlotResponse {
  id: number;
  position: string;
  row: number | null;
  col: number | null;
  player_id: number;
  player?: IPlayersResponse;
}

// Payload uses send type
export interface IDreamTeamPayload {
  formation: string;
  slots: IDreamTeamSlot[];
}

// Response uses receive type
export interface IDreamTeamResponse {
  id: number;
  formation: string;
  total_score: number;
  slots: IDreamTeamSlotResponse[]; // ← changed
}

export interface ITeamsPayload {
  limit?: number;
  skip?: number;
  name?: string;
  leagueName?: string;
  nationalityName?: string;
  minOverall?: number;
  maxOverall?: number;
  minAttack?: number;
  minMidfield?: number;
  minDefence?: number;
  teamType?: string;
}

export interface ITeamsResponse {
  id: number;
  name: string;
  league_name: string;
  nationality_name: string;
  overall: number;
  attack: number;
  midfield: number;
  defence: number;
  home_stadium: string;
  logo_url: string;
}

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

export type SlotPlayers = Record<StatKey, IPlayersResponse | undefined>;

export interface PageState {
  identity: PlayerIdentity;
  stats: PlayerStats;
  mode: "view" | "edit";
}

export interface Formation {
  id: string;
  label: string;
  description: string;
  tacticalFit: string;
  rows: string[][];
}

export type SelectedPlayers = Record<string, IPlayersResponse | undefined>;
