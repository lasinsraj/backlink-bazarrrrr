import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Copy, ExternalLink } from "lucide-react";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  keywords?: string | null;
  targetUrl?: string | null;
}

export const OrderDetailsDialog = ({
  isOpen,
  onClose,
  keywords,
  targetUrl,
}: OrderDetailsDialogProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {keywords && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Keywords</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(keywords, "Keywords")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <p className="text-sm bg-muted p-2 rounded-md">{keywords}</p>
            </div>
          )}
          {targetUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Target URL</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(targetUrl, "Target URL")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(targetUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                </div>
              </div>
              <p className="text-sm bg-muted p-2 rounded-md break-all">
                {targetUrl}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};