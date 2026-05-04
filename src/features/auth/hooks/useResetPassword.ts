import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../apis/resetPassword";
import { IResetPasswordPayload, IResetPasswordResponse } from "../types";
import { AxiosError } from "axios";

export const useResetPassword = () => {
  return useMutation<
    IResetPasswordResponse,
    AxiosError<{ detail?: string; message?: string }>,
    IResetPasswordPayload
  >({
    mutationFn: resetPassword,
  });
};
