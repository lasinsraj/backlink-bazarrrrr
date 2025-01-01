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

  // Function to check if string is a UUID
  const isUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Function to convert slug back to a searchable title
  const slugToTitle = (slug: string) => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      if (!slug) {
        navigate('/404', { replace: true });
        return null;
      }

      let query = supabase.from("products").select("*, user_id");

      // If it's a UUID, query by ID, otherwise query by title
      if (isUUID(slug)) {
        query = query.eq('id', slug);
      } else {
        const titleFromSlug = slugToTitle(slug);
        // Use ilike for case-insensitive matching and exact title match
        query = query.ilike('title', titleFromSlug);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
        navigate('/404', { replace: true });
        return null;
      }

      if (!data) {
        console.log('No product found for slug:', slug);
        navigate('/404', { replace: true });
        return null;
      }

      return data;
    },
    retry: false // Don't retry on 404s
  });

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return null; // Navigation will handle this case
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