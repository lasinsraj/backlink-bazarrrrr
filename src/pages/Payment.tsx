import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(*)")
        .eq("id", orderId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          orderId: orderId,
          productId: order?.products?.id,
          price: order?.products?.price,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (orderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{order.products?.title}</h2>
          <p className="text-gray-600 mb-2">{order.products?.description}</p>
          <div className="text-xl font-bold text-primary">${order.products?.price}</div>
        </div>

        <Button
          onClick={handlePayment}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default Payment;