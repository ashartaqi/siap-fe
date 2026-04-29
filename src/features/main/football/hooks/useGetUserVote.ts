import { useQuery } from "@tanstack/react-query";
import { getUserVote } from "../apis/getUserVote";

const useGetUserVote = () => {
  return useQuery({
    queryKey: ["user-vote"],
    queryFn: getUserVote,
  });
};

export { useGetUserVote };
