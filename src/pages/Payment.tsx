import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
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
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Order not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Payment</CardTitle>
          <CardDescription>
            {order.products?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">{order.products?.title}</h2>
            <p className="text-gray-600 mb-4">{order.products?.description}</p>
            <div className="text-2xl font-bold text-primary">${order.products?.price}</div>
          </div>

          <div className="space-y-2">
            {order.keywords && (
              <p className="text-sm text-gray-600">Keywords: {order.keywords}</p>
            )}
            {order.target_url && (
              <p className="text-sm text-gray-600">Target URL: {order.target_url}</p>
            )}
          </div>

          <Button
            onClick={handlePayment}
            className="w-full h-12 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <CreditCard className="h-5 w-5 mr-2" />
            )}
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;