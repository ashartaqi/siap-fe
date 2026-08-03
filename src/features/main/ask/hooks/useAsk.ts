import { useMutation } from "@tanstack/react-query";
import { askSiap } from "../apis/ask";

export const useAskSiap = () => {
  return useMutation({
    mutationFn: (question: string) => askSiap(question),
  });
};
