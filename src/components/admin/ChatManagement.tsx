import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ChatList from "./ChatList";
import ChatDialog from "./ChatDialog";
import { type ChatMessage } from "./types";

const ChatManagement = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('chat_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (payload.new.product_id === selectedChat) {
            fetchChatMessages(selectedChat);
          }
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

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

      const senderIds = [...new Set(messages?.map(msg => msg.sender_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email")
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

  const fetchChatMessages = async (productId: string) => {
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

      const senderIds = [...new Set(data?.map(msg => msg.sender_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email")
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
      <ChatList messages={messages} onViewChat={fetchChatMessages} />
      <ChatDialog
        open={!!selectedChat}
        onOpenChange={(open) => !open && setSelectedChat(null)}
        messages={chatMessages}
        productId={selectedChat}
        isLoading={chatLoading}
      />
    </div>
  );
};

export default ChatManagement;