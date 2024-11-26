import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface ProductChatProps {
  productId: string;
}

const ProductChat = ({ productId }: ProductChatProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    fetchMessages();

    const channel = supabase
      .channel(`product-${productId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId, open]);

  const handleSendMessage = async () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        content: message.trim(),
        product_id: productId,
        sender_id: session.user.id,
      });

      if (error) throw error;

      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat with Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chat with Seller</DialogTitle>
          <DialogDescription>
            Send messages to discuss details about this product
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-50 p-4 rounded-lg h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-gray-500">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-gray-500">No messages yet</span>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender_id === session?.user?.id
                      ? "ml-auto bg-primary text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.content}
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductChat;