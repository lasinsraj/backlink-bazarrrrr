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
} from "@/components/ui/dialog";

interface ProductChatProps {
  productId: string;
}

const ProductChat = ({ productId }: ProductChatProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: true });
      
      if (error) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      setMessages(data || []);
    };

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
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId, toast, open]);

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

    const { error } = await supabase.from("messages").insert({
      content: message,
      product_id: productId,
      sender_id: session.user.id,
    });

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMessage("");
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
        </DialogHeader>
        <div className="bg-gray-50 p-4 rounded-lg h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => (
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
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="resize-none"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductChat;