import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_email?: string;
  product_id: string;
  product_title?: string;
}

const ChatManagement = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          *,
          products (
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user emails for each unique sender_id
      const senderIds = [...new Set(messages?.map(msg => msg.sender_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email:id")
        .in("id", senderIds);

      if (profilesError) throw profilesError;

      const emailMap = new Map(profiles?.map(profile => [profile.id, profile.email]));

      const enrichedMessages = messages?.map(msg => ({
        ...msg,
        sender_email: emailMap.get(msg.sender_id) || "Unknown",
        product_title: msg.products?.title || "Unknown Product"
      })) || [];

      setMessages(enrichedMessages);
    } catch (error: any) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const viewChat = async (productId: string) => {
    try {
      setChatLoading(true);
      setSelectedChat(productId);
      
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          products (
            title
          )
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch user emails
      const senderIds = [...new Set(data?.map(msg => msg.sender_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email:id")
        .in("id", senderIds);

      if (profilesError) throw profilesError;

      const emailMap = new Map(profiles?.map(profile => [profile.id, profile.email]));

      const enrichedMessages = data?.map(msg => ({
        ...msg,
        sender_email: emailMap.get(msg.sender_id) || "Unknown",
        product_title: msg.products?.title || "Unknown Product"
      })) || [];

      setChatMessages(enrichedMessages);
    } catch (error: any) {
      toast({
        title: "Error fetching chat",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Chat Management</h2>
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
                  onClick={() => viewChat(message.product_id)}
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

      <Dialog open={!!selectedChat} onOpenChange={() => setSelectedChat(null)}>
        <DialogContent className="max-w-2xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Chat History - {chatMessages[0]?.product_title || "Loading..."}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-4">
            {chatLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex flex-col space-y-1"
                  >
                    <div className="text-sm text-muted-foreground">
                      {msg.sender_email} - {new Date(msg.created_at).toLocaleString()}
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatManagement;