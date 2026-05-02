export interface MatchComment {
  id: number;
  user_id: number;
  match_id: number;
  username: string;
  content: string;
  created_at: string;
}

export interface IFixturesPayload {
  league?: string;
  limit?: number;
  status_filter?: string;
  home_team?: string;
  away_team?: string;
}

export interface IFormation {
  id: string;
  label: string;
  description: string;
  tacticalFit: string;
  rows: string[][];
}

export interface IPlayerAttributes {
  valid_player_positions: Record<string, string[]>;
  valid_preferred_feet: string[];
  player_stat_min: number;
  player_stat_max: number;
  player_total_stats_max: number;
  all_positions: string[];
  stat_field_map: Record<string, string>;
  default_identity: {
    name: string;
    position: string;
    nationality: string;
    shirt_number: number;
    preferred_foot: string;
  };
  default_stats: Record<string, number>;
}

export interface IVotePayload {
  fixture_id: number;
  prediction_home_score: number;
  prediction_away_score: number;
}

export interface IVoteResponse {
  id: number;
  user_id: number;
  fixture_id: number;
  prediction_home_score: number;
  prediction_away_score: number;
}

export interface IVoteWithUser {
  id: number;
  user_id: number;
  username: string;
  first_name: string;
  fixture_id: number;
  prediction_home_score: number;
  prediction_away_score: number;
}

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

export interface KnockoutTie {
  id: string;
  home_team: string;
  away_team: string;
  leg1: Match;
  leg2?: Match;
  aggregate_home: number | null;
  aggregate_away: number | null;
  winner: string | null;
  status: string;
  date: string;
}

export interface Player {
  id: number;
  short_name: string;
  long_name: string;
  player_positions: string;
  overall: number;
  age: number;
  club_name?: string | null;
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
