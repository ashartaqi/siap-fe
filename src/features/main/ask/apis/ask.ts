import axiosClient from "@/lib/axiosClient";
import { AskResponse } from "../types";

export async function askSiap(question: string): Promise<AskResponse> {
  const response = await axiosClient.post("/ask", { question });
  return response.data;
}
