import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditProductFormProps {
  initialData: {
    title: string;
    description: string;
    price: string;
    category: string;
    image_url: string;
  };
  onSubmit: (data: any) => Promise<void>;
}

const EditProductForm = ({ initialData, onSubmit }: EditProductFormProps) => {
  const [product, setProduct] = useState(initialData);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
    await onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={product.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-2">
          Price
        </label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={product.price}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2">
          Category
        </label>
        <Input
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Product Image
        </label>
        {product.image_url && (
          <div className="mb-4">
            <div className="relative w-32 h-32 group">
              <img 
                src={product.image_url} 
                alt={product.title} 
                className="w-full h-full object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleImageDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="cursor-pointer"
        />
        {uploading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={uploading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditProductForm;