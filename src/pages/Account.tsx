import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Eye, CreditCard, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Account = () => {
  const { section = "profile" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { session } = useSessionContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(*)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    const fetchPaymentMethods = async () => {
      setLoadingPaymentMethods(true);
      try {
        const { data, error } = await supabase.functions.invoke('manage-payment-methods', {
          method: 'GET',
        });

        if (error) throw error;
        setPaymentMethods(data.paymentMethods || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load payment methods",
          variant: "destructive",
        });
      } finally {
        setLoadingPaymentMethods(false);
      }
    };

    fetchOrders();
    fetchPaymentMethods();

    // Check for success parameter in URL
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("success") === "true") {
      toast({
        title: "Payment successful!",
        description: "Your order has been processed successfully.",
      });
      // Clear the URL parameters
      navigate("/account/orders", { replace: true });
    } else if (searchParams.get("canceled") === "true") {
      toast({
        title: "Payment canceled",
        description: "Your payment was canceled.",
        variant: "destructive",
      });
      navigate("/account/orders", { replace: true });
    }
  }, [session, navigate, location, toast]);

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      const { error } = await supabase.functions.invoke('manage-payment-methods', {
        method: 'DELETE',
        body: { paymentMethodId },
      });

      if (error) throw error;

      setPaymentMethods(methods => methods.filter(method => method.id !== paymentMethodId));
      toast({
        title: "Success",
        description: "Payment method removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove payment method",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <Tabs defaultValue={section} onValueChange={(value) => navigate(`/account/${value}`)}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="mt-1">{session?.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-gradient-card backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{order.products.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm">Status: <span className="font-medium">{order.status}</span></p>
                      <p className="text-sm">Price: <span className="font-medium">${order.products.price}</span></p>
                      {order.keywords && (
                        <p className="text-sm">Keywords: <span className="font-medium">{order.keywords}</span></p>
                      )}
                      {order.target_url && (
                        <p className="text-sm">Target URL: <span className="font-medium">{order.target_url}</span></p>
                      )}
                    </div>
                    
                    {order.attachment_url && (
                      <div className="flex items-center gap-2 mt-4">
                        <p className="text-sm font-medium">Attachment:</p>
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
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPaymentMethods ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CreditCard className="h-6 w-6" />
                        <div>
                          <p className="font-medium">•••• {method.card.last4}</p>
                          <p className="text-sm text-gray-500">
                            Expires {method.card.exp_month}/{method.card.exp_year}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No payment methods added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
    </div>
  );
};

export default Account;