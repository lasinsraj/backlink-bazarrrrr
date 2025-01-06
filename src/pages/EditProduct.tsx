import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import EditProductForm from "@/components/admin/EditProductForm";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate("/admin");
      return;
    }
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      if (!id) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (updatedProduct: any) => {
    try {
      if (!id) throw new Error("Product ID is required");

      const { error } = await supabase
        .from("products")
        .update({
          title: updatedProduct.title,
          description: updatedProduct.description,
          price: parseFloat(updatedProduct.price),
          category: updatedProduct.category,
          image_url: updatedProduct.image_url,
          meta_title: updatedProduct.meta_title,
          meta_description: updatedProduct.meta_description,
          meta_keywords: updatedProduct.meta_keywords,
          canonical_url: updatedProduct.canonical_url,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!id || !product) {
    return (
      <div className="container py-8">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <EditProductForm initialData={product} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProduct;