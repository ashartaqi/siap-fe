import axiosClient from "@/lib/axiosClient";

export interface ChatMessage {
  id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
}

export async function getChatMessages(): Promise<ChatMessage[]> {
  const response = await axiosClient.get("/community");
  return response.data;
}
