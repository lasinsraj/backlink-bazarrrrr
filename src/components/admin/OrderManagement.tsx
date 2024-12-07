import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download, Upload, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderTableHeader } from "./OrderTableHeader";
import { OrderDetailsDialog } from "./OrderDetailsDialog";

const OrderManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          products (
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData) {
        const userIds = [...new Set(ordersData.map(order => order.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, email")
          .in("id", userIds);

        const emailMap = new Map(
          profilesData?.map(profile => [profile.id, profile.email]) || []
        );

        const ordersWithEmails = ordersData.map(order => ({
          ...order,
          userEmail: emailMap.get(order.user_id) || "Unknown User",
        }));

        setOrders(ordersWithEmails);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatOrderId = (id: string) => {
    const shortId = id.slice(-4);
    return `#${shortId.padStart(4, "0")}`;
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated",
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadingOrderId(orderId);
      uploadFile(file, orderId);
    }
  };

  const uploadFile = async (file: File, orderId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${orderId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          attachment_url: publicUrl,
          attachment_name: file.name
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSelectedFile(null);
      setUploadingOrderId(null);
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
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
      <h2 className="text-2xl font-bold">Order Management</h2>
      <Table>
        <OrderTableHeader />
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono">
                {formatOrderId(order.id)}
              </TableCell>
              <TableCell>{order.userEmail}</TableCell>
              <TableCell>{order.products?.title}</TableCell>
              <TableCell>
                <Select
                  defaultValue={order.status}
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{order.payment_status}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(order)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {order.attachment_url ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewUrl(order.attachment_url)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <a
                        href={order.attachment_url}
                        download={order.attachment_name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, order.id)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingOrderId === order.id}
                      />
                      <Button variant="outline" size="sm">
                        {uploadingOrderId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <OrderDetailsDialog
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        keywords={selectedOrder?.keywords}
        targetUrl={selectedOrder?.target_url}
      />
    </div>
  );
};

export default OrderManagement;
