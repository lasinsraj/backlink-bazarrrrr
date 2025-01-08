import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AccountProfile } from "@/components/account/AccountProfile";
import { AccountOrders } from "@/components/account/AccountOrders";
import { AccountPayments } from "@/components/account/AccountPayments";

const Account = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check for success parameter in URL
    const searchParams = new URLSearchParams(window.location.search);
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
  }, [session, navigate, toast]);

  if (!session) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <Routes>
        <Route path="/" element={
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" onClick={() => navigate("/account/profile")}>Profile</TabsTrigger>
              <TabsTrigger value="orders" onClick={() => navigate("/account/orders")}>Orders</TabsTrigger>
              <TabsTrigger value="payments" onClick={() => navigate("/account/payments")}>Payment Methods</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <AccountProfile session={session} />
            </TabsContent>

            <TabsContent value="orders">
              <AccountOrders session={session} />
            </TabsContent>

            <TabsContent value="payments">
              <AccountPayments session={session} />
            </TabsContent>
          </Tabs>
        } />
        <Route path="/profile" element={<AccountProfile session={session} />} />
        <Route path="/orders" element={<AccountOrders session={session} />} />
        <Route path="/payments" element={<AccountPayments session={session} />} />
      </Routes>
    </div>
  );
};

export default Account;