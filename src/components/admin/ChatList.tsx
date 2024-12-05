import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { type ChatMessage } from "./types";

interface ChatListProps {
  messages: ChatMessage[];
  onViewChat: (productId: string) => void;
}

const ChatList = ({ messages, onViewChat }: ChatListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Last Message From</TableHead>
          <TableHead>Last Message</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((message) => (
          <TableRow key={message.id}>
            <TableCell>{message.product_title}</TableCell>
            <TableCell>{message.sender_email}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {message.content}
            </TableCell>
            <TableCell>
              {new Date(message.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewChat(message.product_id)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                View Chat
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ChatList;