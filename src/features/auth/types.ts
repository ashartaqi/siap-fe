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
  token?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  token_type: string;
  reward_amount?: number;
}

export interface IResetPasswordPayload {
  email: string;
  current_password: string;
  password: string;
  confirm_password: string;
}

export interface IResetPasswordResponse {
  message: string;
}
