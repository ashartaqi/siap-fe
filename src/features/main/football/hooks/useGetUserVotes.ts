import { useQuery } from "@tanstack/react-query";
import { getUserVotes } from "../apis/getUserVotes";

export const useGetUserVotes = () => {
  return useQuery({
    queryKey: ["user-votes"],
    queryFn: getUserVotes,
  });
};
