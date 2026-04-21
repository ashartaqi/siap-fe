import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../apis/getCountries";

const useGetCountries = (enabled = true) => {
  return useQuery<string[], Error>({
    queryKey: ["countries"],
    queryFn: getCountries,
    enabled,
  });
};

export { useGetCountries };
