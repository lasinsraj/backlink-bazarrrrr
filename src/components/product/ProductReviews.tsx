import { Star, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Database } from "@/integrations/supabase/types";

interface ProductReviewsProps {
  productId: string;
}

type ReviewWithProfile = Database['public']['Tables']['reviews']['Row'] & {
  user: {
    email: string | null;
  } | null;
};

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const { toast } = useToast();
  const { session } = useSessionContext();

  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      // First get the reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      
      if (reviewsError) throw reviewsError;

      // Then get the profiles for these reviews, but only if user_id exists
      const reviewsWithProfiles = await Promise.all(
        (reviewsData || []).map(async (review) => {
          if (!review.user_id) {
            return {
              ...review,
              user: null
            };
          }

          const { data: profileData } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", review.user_id)
            .single();

          return {
            ...review,
            user: profileData
          };
        })
      );

      return reviewsWithProfiles as ReviewWithProfile[];
    },
  });

  const { data: userOrders } = useQuery({
    queryKey: ["user-orders", productId],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("product_id", productId)
        .eq("user_id", session?.user.id)
        .eq("status", "completed");
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmitReview = async () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to leave a review",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: session.user.id,
        rating,
        comment: newReview,
      });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      setNewReview("");
      setRating(5);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const hasPurchased = userOrders && userOrders.length > 0;

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
      
      {hasPurchased && (
        <div className="mb-8 p-4 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Write a Review</h3>
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 cursor-pointer ${
                  star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Share your experience with this product..."
            className="mb-4"
          />
          <Button 
            onClick={handleSubmitReview}
            disabled={!newReview.trim()}
          >
            Submit Review
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {reviews?.map((review) => (
          <div key={review.id} className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-600">
                  {review.user?.email || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mt-2">{review.comment}</p>
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