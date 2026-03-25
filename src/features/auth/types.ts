export interface IRegisterPayload {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
}

export interface IRegisterResponse {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  token: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  token_type: string;
}

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
  name: string;
  position: string;
  overall: number;
  age: number;
  club: string;
  nation: string;
  foot: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
}
