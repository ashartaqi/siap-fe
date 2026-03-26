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

export interface IPlayersResponse {
  id: number;
  short_name: string;
  long_name: string;
  player_positions: string;
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
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
  player_face_url: string;
}

export interface IGoalKeeperPayload {
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

export interface IGoalKeeperResponse {
  id: number;
  short_name: string;
  long_name: string;
  player_positions: string;
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

  diving: number;
  handling: number;
  kicking: number;
  positioning: number;
  reflexes: number;
  speed: number;

  player_face_url: string;
}
