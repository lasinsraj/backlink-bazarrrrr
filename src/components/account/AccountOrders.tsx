import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Eye, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountOrdersProps {
  session: Session;
}

export const AccountOrders = ({ session }: AccountOrdersProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [keywords, setKeywords] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, products(*)")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setOrders(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session.user.id, toast]);

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
  };

  const handleEdit = (order: any) => {
    setEditingOrder(order);
    setKeywords(order.keywords || "");
    setTargetUrl(order.target_url || "");
  };

  const handleSaveDetails = async () => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          keywords,
          target_url: targetUrl,
        })
        .eq("id", editingOrder?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order details updated successfully",
      });

      // Update local state
      setOrders(orders.map(order => 
        order.id === editingOrder?.id 
          ? { ...order, keywords, target_url: targetUrl }
          : order
      ));
      setEditingOrder(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update order details",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{order.products.title}</h3>
                <p className="text-sm text-gray-500">Status: {order.status}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(order.created_at).toLocaleDateString()}
                </p>
                {order.keywords && (
                  <p className="text-sm text-gray-500">Keywords: {order.keywords}</p>
                )}
                {order.target_url && (
                  <p className="text-sm text-gray-500">Target URL: {order.target_url}</p>
                )}
                {(!order.keywords || !order.target_url) && order.payment_status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(order)}
                    className="mt-2"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Add Details
                  </Button>
                )}
              </div>
              
              {order.attachment_url && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(order.attachment_url)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <a
                    href={order.attachment_url}
                    download={order.attachment_name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
            <DialogDescription>
              Preview of the attachment for your order
            </DialogDescription>
          </DialogHeader>
          {previewUrl && (
            <div className="aspect-video">
              {previewUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
                <img
                  src={previewUrl}
                  alt="Attachment preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title="Attachment preview"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Order Details</DialogTitle>
            <DialogDescription>
              Add keywords and target URL for your order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Enter keywords"
              />
            </div>
            <div>
              <Label htmlFor="targetUrl">Target URL</Label>
              <Input
                id="targetUrl"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Enter target URL"
              />
            </div>
            <Button onClick={handleSaveDetails}>Save Details</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};