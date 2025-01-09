import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductBasicForm from "./ProductBasicForm";
import ProductImageForm from "./ProductImageForm";
import ProductSEOForm from "./ProductSEOForm";

interface EditProductFormProps {
  initialData: {
    title: string;
    description: string;
    price: string;
    category: string;
    image_url: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    canonical_url?: string;
  };
  onSubmit: (data: any) => Promise<void>;
}

const EditProductForm = ({ initialData, onSubmit }: EditProductFormProps) => {
  const [product, setProduct] = useState(initialData);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (name: string, value: string) => {
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setProduct(prev => ({ ...prev, image_url: publicUrl }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      if (!product.image_url) return;

      const fileName = product.image_url.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from('products')
        .remove([fileName]);

      if (error) throw error;

      setProduct(prev => ({ ...prev, image_url: '' }));
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(product);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <ProductBasicForm 
            product={product}
            onChange={handleChange}
          />
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <ProductSEOForm
            seoData={{
              meta_title: product.meta_title || '',
              meta_description: product.meta_description || '',
              meta_keywords: product.meta_keywords || '',
              canonical_url: product.canonical_url || '',
            }}
            onChange={handleChange}
          />
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <ProductImageForm
            imageUrl={product.image_url}
            title={product.title}
            uploading={uploading}
            onUpload={handleImageUpload}
            onDelete={handleImageDelete}
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={uploading || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EditProductForm;