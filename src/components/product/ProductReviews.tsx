import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews?.map((review) => (
          <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
        {(!reviews || reviews.length === 0) && (
          <p className="text-gray-500 text-center py-4">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;