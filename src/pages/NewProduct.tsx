import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import EditProductForm from "@/components/admin/EditProductForm";

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

  const handleSubmit = async (productData: any) => {
    try {
      // Insert new product instead of updating
      const { data, error } = await supabase
        .from("products")
        .insert([{
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price),
          category: productData.category,
          image_url: productData.image_url || null,
          meta_title: productData.meta_title || null,
          meta_description: productData.meta_description || null,
          meta_keywords: productData.meta_keywords || null,
          canonical_url: productData.canonical_url || null,
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating product:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Product created successfully",
      });
      navigate("/admin/products");
    } catch (error: any) {
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