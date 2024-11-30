import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setProduct({
          title: data.title,
          description: data.description || "",
          price: data.price.toString(),
          category: data.category,
        });
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: product.title,
          description: product.description,
          price: parseFloat(product.price),
          category: product.category,
        })
        .eq("id", id);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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

        <div className="flex gap-4">
          <Button type="submit">
            Update Product
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/admin")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;