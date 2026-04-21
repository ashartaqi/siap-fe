import axiosClient from "@/lib/axiosClient";

export const getCountries = async (): Promise<string[]> => {
  const res = await axiosClient.get<string[]>("/countries/countries");
  return Array.isArray(res.data) ? res.data : [];
};
