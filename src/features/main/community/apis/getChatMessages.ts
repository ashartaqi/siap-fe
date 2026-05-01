import axiosClient from "@/lib/axiosClient";
import { ChatMessage } from "../types";

export async function getChatMessages(): Promise<ChatMessage[]> {
  const response = await axiosClient.get("/community");
  return response.data;
}
