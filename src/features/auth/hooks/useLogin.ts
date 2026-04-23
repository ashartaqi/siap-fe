import { useMutation } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { ILoginPayload, ILoginResponse } from "../types";
import { login } from "../apis/login";

const useLogin = () => {
  return useMutation<ILoginResponse, TAxiosError, ILoginPayload>({
    mutationFn: login,
  });
};

export { useLogin };
