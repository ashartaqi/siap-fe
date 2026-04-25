export interface Match {
  id: number | string;
  home_team: string;
  away_team: string;
  home_team_score?: number | null;
  away_team_score?: number | null;
  home_score?: number | null;
  away_score?: number | null;
  status: string; // e.g. "FINISHED", "IN_PLAY", "TIMED", "SCHEDULED", "PAUSED", "HALFTIME"
  date?: string;
  utc_date?: string;
  minute?: number | null;
  league?: string;
  winner?: string | null;
  matchday?: number;
}

export interface Player {
  id: number;
  short_name: string;
  long_name: string;
  player_positions: string;
  overall: number;
  age: number;
  club_name: string;
  nationality_name: string;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physic?: number;
  player_face_url?: string;
}

export interface Club {
  id: number;
  name: string;
  league_name: string;
  nationality_name: string;
  overall: number;
  attack: number;
  midfield: number;
  defence: number;
  home_stadium: string;
  captain: string;
  logo_url: string;
}

export interface StandingRow {
  id: number | string;
  position: number;
  team_name: string;
  played_games: number;
  points: number;
  won?: number;
  draw?: number;
  lost?: number;
  goals_for?: number;
  goals_against?: number;
  goal_difference?: number;
  league?: string;
  logo_url?: string;
  form?: string[];
  forms?: string[];
}
