import axiosClient from "@/lib/axiosClient";
import { ChatMessage } from "./getChatMessages";

export async function sendChatMessage(content: string): Promise<ChatMessage> {
  const response = await axiosClient.post("/community", { content });
  return response.data;
}
