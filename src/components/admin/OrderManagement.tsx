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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          products (
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user emails directly from auth.users using the service role
      const ordersWithEmails = await Promise.all(
        (data || []).map(async (order) => {
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
            order.user_id
          );
          
          if (userError) {
            console.error("Error fetching user:", userError);
            return {
              ...order,
              userEmail: 'N/A'
            };
          }

          return {
            ...order,
            userEmail: userData?.user?.email || 'N/A'
          };
        })
      );

      setOrders(ordersWithEmails);
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
    // Take the last 4 characters of the UUID
    const shortId = id.slice(-4);
    // Convert to a number and format with leading zeros
    return `#${shortId.padStart(4, '0')}`;
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
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer Email</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
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
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderManagement;