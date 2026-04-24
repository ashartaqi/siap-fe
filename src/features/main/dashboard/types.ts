export interface IPlayersPayload {
  limit?: number;
  teamId?: number;
  name?: string;
  nationalityName?: string;
  position?: string;
  minOverall?: number;
  maxOverall?: number;
  minAge?: number;
  maxAge?: number;
  preferredFoot?: string;
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
  club_team_id: number;
  club_name: string;
  nationality_id: number;
  nationality_name: string;
  preferred_foot: string;
  weak_foot: number;
  skill_moves: number;
  work_rate: string;
  player_stats: IPlayerStats | null;
  goalkeeper_stats: IGoalkeeperStats | null;
  player_face_url: string;
}

export interface IDreamPlayerPayload {
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
