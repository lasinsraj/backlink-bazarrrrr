import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface ProductImageFormProps {
  imageUrl: string;
  title: string;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDelete: () => Promise<void>;
}

const ProductImageForm = ({ imageUrl, title, uploading, onUpload, onDelete }: ProductImageFormProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Product Image
      </label>
      {imageUrl && (
        <div className="mb-4">
          <div className="relative w-32 h-32 group">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onDelete}
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
        onChange={onUpload}
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
  );
};

export default ProductImageForm;