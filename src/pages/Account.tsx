import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AccountProfile } from "@/components/account/AccountProfile";
import { AccountOrders } from "@/components/account/AccountOrders";
import { AccountPayments } from "@/components/account/AccountPayments";

const Account = () => {
  const { section = "profile" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSessionContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

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

  if (!session) {
    return null;
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
          <AccountProfile session={session} />
        </TabsContent>

        <TabsContent value="orders">
          <AccountOrders session={session} />
        </TabsContent>

        <TabsContent value="payments">
          <AccountPayments session={session} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;