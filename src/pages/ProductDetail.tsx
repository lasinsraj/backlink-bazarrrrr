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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      if (!slug) {
        navigate('/404', { replace: true });
        return null;
      }

      // First try to find by title-based slug
      const { data: productsByTitle, error: titleError } = await supabase
        .from("products")
        .select("*")
        .eq('id', slug)
        .maybeSingle();

      if (productsByTitle) {
        // If found by ID, redirect to slug URL
        const titleSlug = generateSlug(productsByTitle.title);
        if (slug !== titleSlug) {
          navigate(`/product/${titleSlug}`, { replace: true });
        }
        return productsByTitle;
      }

      // If not found by ID, search by slug
      const { data: products, error: slugError } = await supabase
        .from("products")
        .select("*");

      if (slugError) throw slugError;

      const product = products?.find(p => generateSlug(p.title) === slug);

      if (!product) {
        toast({
          title: "Product not found",
          description: "The requested product could not be found.",
          variant: "destructive",
        });
        navigate('/404', { replace: true });
        return null;
      }

      return product;
    },
    retry: false
  });

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return null;
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