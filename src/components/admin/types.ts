export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_email?: string;
  product_id: string;
  product_title?: string;
}