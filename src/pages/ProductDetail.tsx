import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Helmet } from "react-helmet";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import ProductChat from "@/components/product/ProductChat";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSessionContext();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) {
        navigate('/shop');
        return null;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        toast({
          title: "Product not found",
          description: "The requested product could not be found.",
          variant: "destructive",
        });
        navigate('/shop');
        return null;
      }

      return data;
    },
    retry: false
  });

  if (isLoading) {
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
  const baseUrl = "https://backlinkbazaar.online";
  const productUrl = `${baseUrl}/product/${product.id}`;

  return (
    <>
      <Helmet>
        <title>{`${product.title} - Premium Backlinks | Backlink Bazaar`}</title>
        <meta name="description" content={product.description || `Get high-quality backlinks with our ${product.title}. Boost your website's SEO with verified domains and premium guest posts.`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.title} - Premium Backlinks | Backlink Bazaar`} />
        <meta property="og:description" content={product.description || `Get high-quality backlinks with our ${product.title}. Boost your website's SEO with verified domains and premium guest posts.`} />
        <meta property="og:image" content={product.image_url || defaultImage} />
        <meta property="og:url" content={productUrl} />
        <link rel="canonical" href={productUrl} />
      </Helmet>

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
    </>
  );
};

export default ProductDetail;