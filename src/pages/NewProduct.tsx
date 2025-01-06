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
      const { error } = await supabase
        .from("products")
        .insert({
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price),
          category: productData.category,
          image_url: productData.image_url,
          meta_title: productData.meta_title,
          meta_description: productData.meta_description,
          meta_keywords: productData.meta_keywords,
          canonical_url: productData.canonical_url,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully",
      });
      navigate("/admin");
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