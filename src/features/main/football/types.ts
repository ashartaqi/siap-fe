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
