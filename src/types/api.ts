import { AxiosError } from "axios";

export interface IApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export type TAxiosError<T = IApiError> = AxiosError<T>;

export interface IApiResponse<T> {
  data: T;
  message: string;
  status: string;
}
