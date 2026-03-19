// src/features/auth/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { TAxiosError } from "@/types/api";
import { IRegisterResponse, IRegisterPayload } from "../types";
import { register } from "../apis/register";

const useRegister = () => {
  return useMutation<IRegisterResponse, TAxiosError, IRegisterPayload>({
    mutationFn: register,
  });
};

export { useRegister };
