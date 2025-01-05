import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPostForm {
  title: string;
  content: string;
  image: FileList;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
}

const BlogManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BlogPostForm>();

  const onSubmit = async (data: BlogPostForm) => {
    try {
      setIsLoading(true);
      
      let imageUrl = "";
      
      if (data.image?.[0]) {
        const file = data.image[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `blog/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      const blogPost = {
        title: data.title,
        description: data.content,
        category: 'blog',
        price: 0,
        image_url: imageUrl || null,
        meta_title: data.meta_title || data.title,
        meta_description: data.meta_description || null,
        meta_keywords: data.meta_keywords || null,
        canonical_url: data.canonical_url || null,
      };

      const { error } = await supabase
        .from('products')
        .insert([blogPost]); // Wrap blogPost in an array

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog post published successfully",
      });
      
      reset();
    } catch (error: any) {
      console.error('Error publishing blog post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Publish Blog Post</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter blog post title"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            {...register("content", { required: "Content is required" })}
            placeholder="Write your blog post content here..."
            className="min-h-[200px]"
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meta_title">Meta Title (SEO)</Label>
          <Input
            id="meta_title"
            {...register("meta_title")}
            placeholder="Enter meta title (50-60 characters recommended)"
            maxLength={60}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta Description (SEO)</Label>
          <Textarea
            id="meta_description"
            {...register("meta_description")}
            placeholder="Enter meta description (150-160 characters recommended)"
            maxLength={160}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_keywords">Meta Keywords (SEO)</Label>
          <Input
            id="meta_keywords"
            {...register("meta_keywords")}
            placeholder="Enter keywords separated by commas"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="canonical_url">Canonical URL (SEO)</Label>
          <Input
            id="canonical_url"
            {...register("canonical_url")}
            placeholder="Enter canonical URL if different from current URL"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Featured Image</Label>
          <div className="flex items-center gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("image")}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("image")?.click()}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </div>
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Post"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default BlogManagement;