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
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSessionContext();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      // Convert slug back to title format for comparison
      const titleFromSlug = slug?.replace(/-/g, ' ');
      
      const { data, error } = await supabase
        .from("products")
        .select("*, user_id")
        .ilike('title', titleFromSlug || '')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No match found
          navigate('/404', { replace: true });
          return null;
        }
        throw error;
      }
      return data;
    },
  });

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
          <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden bg-white shadow-sm">
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

          <div className="space-y-6">
            <ProductInfo product={product} onBuyClick={() => navigate(`/checkout/${product.id}`)} />
            <ProductChat productId={product.id} />
          </div>
        </div>

        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;