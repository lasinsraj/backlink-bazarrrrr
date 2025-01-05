import { Label } from "@/components/ui/label";
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
        <Label htmlFor="meta_title">Meta Title</Label>
        <Input
          id="meta_title"
          value={seoData.meta_title}
          onChange={(e) => onChange("meta_title", e.target.value)}
          placeholder="Enter meta title (50-60 characters recommended)"
          maxLength={60}
        />
      </div>

      <div>
        <Label htmlFor="meta_description">Meta Description</Label>
        <Textarea
          id="meta_description"
          value={seoData.meta_description}
          onChange={(e) => onChange("meta_description", e.target.value)}
          placeholder="Enter meta description (150-160 characters recommended)"
          maxLength={160}
        />
      </div>

      <div>
        <Label htmlFor="meta_keywords">Meta Keywords</Label>
        <Input
          id="meta_keywords"
          value={seoData.meta_keywords}
          onChange={(e) => onChange("meta_keywords", e.target.value)}
          placeholder="Enter keywords separated by commas"
        />
      </div>

      <div>
        <Label htmlFor="canonical_url">Canonical URL</Label>
        <Input
          id="canonical_url"
          value={seoData.canonical_url}
          onChange={(e) => onChange("canonical_url", e.target.value)}
          placeholder="Enter canonical URL if different from current URL"
        />
      </div>
    </div>
  );
};

export default ProductSEOForm;