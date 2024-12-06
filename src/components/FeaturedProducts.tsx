import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Eye, DollarSign } from "lucide-react";

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getDefaultImage = (index: number) => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    ];
    return defaultImages[index % defaultImages.length];
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center animate-[fade-in_0.2s_ease-out]">
          Featured Backlinks
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {products?.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 animate-[fade-in_0.2s_ease-out]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 w-full">
                <img
                  src={product.image_url || getDefaultImage(index)}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getDefaultImage(index);
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    <DollarSign className="inline-block h-6 w-6" />
                    {product.price}
                  </span>
                  <Button
                    onClick={() => navigate(`/product/${product.id}`)}
                    variant="secondary"
                  >
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;