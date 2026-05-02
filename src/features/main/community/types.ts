export interface ChatMessage {
  id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
  reward_amount: number;
}
