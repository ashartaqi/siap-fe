import axiosClient from "@/lib/axiosClient";
import { IFormation } from "../types";

export const getFormations = async (): Promise<IFormation[]> => {
  const res = await axiosClient.get<IFormation[]>("/formations/formations");
  return Array.isArray(res.data) ? res.data : [];
};
