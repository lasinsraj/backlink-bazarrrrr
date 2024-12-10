import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PaymentSettings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [keys, setKeys] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update Stripe keys via Edge Function
      const { error } = await supabase.functions.invoke('update-stripe-keys', {
        body: {
          publishableKey: keys.publishableKey,
          secretKey: keys.secretKey,
          webhookSecret: keys.webhookSecret,
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment settings updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating payment settings:", error);
      toast({
        title: "Error",
        description: "Failed to update payment settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="publishableKey" className="block text-sm font-medium mb-2">
              Stripe Publishable Key
            </label>
            <Input
              id="publishableKey"
              value={keys.publishableKey}
              onChange={(e) => setKeys(prev => ({ ...prev, publishableKey: e.target.value }))}
              placeholder="pk_test_..."
              required
            />
          </div>

          <div>
            <label htmlFor="secretKey" className="block text-sm font-medium mb-2">
              Stripe Secret Key
            </label>
            <Input
              id="secretKey"
              type="password"
              value={keys.secretKey}
              onChange={(e) => setKeys(prev => ({ ...prev, secretKey: e.target.value }))}
              placeholder="sk_test_..."
              required
            />
          </div>

          <div>
            <label htmlFor="webhookSecret" className="block text-sm font-medium mb-2">
              Stripe Webhook Signing Secret
            </label>
            <Input
              id="webhookSecret"
              type="password"
              value={keys.webhookSecret}
              onChange={(e) => setKeys(prev => ({ ...prev, webhookSecret: e.target.value }))}
              placeholder="whsec_..."
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Settings'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;