import { useQuery } from "@tanstack/react-query";
import { IFormation } from "../types";
import { getFormations } from "../apis/getFormations";

const useGetFormations = (enabled = true) => {
  return useQuery<IFormation[], Error>({
    queryKey: ["formations"],
    queryFn: getFormations,
    enabled,
  });
};

export { useGetFormations };
