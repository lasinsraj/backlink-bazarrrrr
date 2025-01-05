import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductSEOFormProps {
  seoData: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    canonical_url: string;
  };
  onChange: (name: string, value: string) => void;
}

const ProductSEOForm = ({ seoData, onChange }: ProductSEOFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="meta_title" className="block text-sm font-medium mb-2">
          SEO Title
        </label>
        <Input
          id="meta_title"
          name="meta_title"
          value={seoData.meta_title}
          onChange={(e) => onChange("meta_title", e.target.value)}
          placeholder="Enter SEO title"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Recommended length: 50-60 characters
        </p>
      </div>

      <div>
        <label htmlFor="meta_description" className="block text-sm font-medium mb-2">
          Meta Description
        </label>
        <Textarea
          id="meta_description"
          name="meta_description"
          value={seoData.meta_description}
          onChange={(e) => onChange("meta_description", e.target.value)}
          placeholder="Enter meta description"
          rows={3}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Recommended length: 150-160 characters
        </p>
      </div>

      <div>
        <label htmlFor="meta_keywords" className="block text-sm font-medium mb-2">
          Meta Keywords
        </label>
        <Input
          id="meta_keywords"
          name="meta_keywords"
          value={seoData.meta_keywords}
          onChange={(e) => onChange("meta_keywords", e.target.value)}
          placeholder="Enter keywords, separated by commas"
        />
      </div>

      <div>
        <label htmlFor="canonical_url" className="block text-sm font-medium mb-2">
          Canonical URL
        </label>
        <Input
          id="canonical_url"
          name="canonical_url"
          value={seoData.canonical_url}
          onChange={(e) => onChange("canonical_url", e.target.value)}
          placeholder="Enter canonical URL"
        />
      </div>
    </div>
  );
};

export default ProductSEOForm;