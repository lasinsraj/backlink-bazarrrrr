import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EditProductForm from "@/components/admin/EditProductForm";
import type { Product } from "@/types";

const NewProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const emptyProduct = {
    title: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
  };

  const generateCanonicalUrl = (title: string): string => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    return `https://backlinkbazaar.com/products/${slug}`;
  };

  const handleSubmit = async (productData: Partial<Product>) => {
    try {
      // Ensure price is a number
      const price = typeof productData.price === 'string' 
        ? parseFloat(productData.price)
        : productData.price;

      if (isNaN(price)) {
        throw new Error('Invalid price value');
      }

      const { error } = await supabase
        .from('products')
        .insert({
          title: productData.title,
          description: productData.description || null,
          price: price,
          category: productData.category,
          image_url: productData.image_url || null,
          meta_title: productData.meta_title || null,
          meta_description: productData.meta_description || null,
          meta_keywords: productData.meta_keywords || null,
          canonical_url: productData.canonical_url || generateCanonicalUrl(productData.title || ''),
        });

      if (error) {
        console.error("Error creating product:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Success",
        description: "Product created successfully",
      });
      navigate("/admin/products");
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
      <EditProductForm initialData={emptyProduct} onSubmit={handleSubmit} />
    </div>
  );
};

export default NewProduct;