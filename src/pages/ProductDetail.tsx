import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import ProductChat from "@/components/product/ProductChat";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSessionContext();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, user_id")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleBuyClick = () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to make a purchase",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    navigate(`/checkout/${id}`);
  };

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Image and Product Info */}
          <div className="space-y-6">
            <div className="relative h-96 rounded-lg overflow-hidden bg-white">
              <img 
                src={product.image_url || defaultImage}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />
            </div>
            <ProductInfo product={product} onBuyClick={handleBuyClick} />
          </div>

          {/* Right Column: Chat */}
          <div className="space-y-8">
            <ProductChat productId={id!} />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ProductReviews productId={id!} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;