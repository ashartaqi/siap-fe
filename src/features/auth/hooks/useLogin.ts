// src/features/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { ILoginResponse, ILoginPayload } from "../types";
import { login } from "../apis/login";

const useLogin = () => {
  return useMutation<ILoginResponse, TAxiosError, ILoginPayload>({
    mutationFn: login,
  });
};

export { useLogin };
