import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type ChatMessage } from "./types";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: ChatMessage[];
  productId: string | null;
  isLoading: boolean;
}

const ChatDialog = ({ open, onOpenChange, messages, productId, isLoading }: ChatDialogProps) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendReply = async () => {
    if (!replyContent.trim() || !productId) return;

    try {
      setIsSending(true);
      const { error } = await supabase.from("messages").insert({
        content: replyContent.trim(),
        product_id: productId,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;

      setReplyContent("");
      toast({
        title: "Reply sent",
        description: "Your message has been sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error sending reply",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Chat History - {messages[0]?.product_title || "Loading..."}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col space-y-1">
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
        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              className="resize-none"
              disabled={isSending}
            />
            <Button 
              onClick={handleSendReply} 
              disabled={!replyContent.trim() || isSending}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;