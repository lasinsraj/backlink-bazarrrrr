import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [keywords, setKeywords] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent, skipDetails = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to make a purchase",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("orders").insert({
      product_id: id,
      user_id: session.user.id,
      keywords: skipDetails ? null : keywords,
      target_url: skipDetails ? null : targetUrl,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "There was an error processing your order",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your order has been placed successfully",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Complete Your Order</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <div className="text-xl font-bold text-primary">${product.price}</div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Target Keywords
            </label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter your target keywords"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target URL
            </label>
            <Input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter your target URL"
              type="url"
            />
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Complete Purchase
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
            >
              Add Details Later
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;