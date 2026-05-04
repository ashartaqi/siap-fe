import { useQuery } from "@tanstack/react-query";
import { getMe } from "../apis/getMe";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user-me"],
    queryFn: getMe,
  });
};
