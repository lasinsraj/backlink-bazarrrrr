import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentSettings = () => {
  const [loading, setLoading] = useState(false);
  const [checkingWebhook, setCheckingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();
  const [keys, setKeys] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
  });

  const webhookUrl = `${window.location.origin}/api/stripe-webhook`;

  const checkWebhookStatus = async () => {
    setCheckingWebhook(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-webhook-status', {
        body: { webhookUrl }
      });

      if (error) throw error;

      setWebhookStatus(data.active ? 'success' : 'error');
      toast({
        title: data.active ? "Webhook is active" : "Webhook is not active",
        description: data.message,
        variant: data.active ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error("Error checking webhook status:", error);
      setWebhookStatus('error');
      toast({
        title: "Error",
        description: "Failed to check webhook status",
        variant: "destructive",
      });
    } finally {
      setCheckingWebhook(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium">Webhook URL</label>
            <div className="flex items-center gap-2">
              <Input value={webhookUrl} readOnly />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl);
                  toast({
                    title: "Copied!",
                    description: "Webhook URL copied to clipboard",
                  });
                }}
              >
                Copy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Use this URL in your Stripe Dashboard webhook settings
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Webhook Status</label>
              <Button
                type="button"
                variant="outline"
                onClick={checkWebhookStatus}
                disabled={checkingWebhook}
              >
                {checkingWebhook ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : webhookStatus === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : webhookStatus === 'error' ? (
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                ) : null}
                Check Status
              </Button>
            </div>
            {webhookStatus && (
              <Alert variant={webhookStatus === 'success' ? 'default' : 'destructive'}>
                <AlertDescription>
                  {webhookStatus === 'success'
                    ? 'Webhook is properly configured and active'
                    : 'Webhook is not properly configured'}
                </AlertDescription>
              </Alert>
            )}
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