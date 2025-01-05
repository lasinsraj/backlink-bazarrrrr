import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductBasicFormProps {
  product: {
    title: string;
    description: string;
    price: string;
    category: string;
  };
  onChange: (name: string, value: string) => void;
}

const ProductBasicForm = ({ product, onChange }: ProductBasicFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={product.title}
          onChange={(e) => onChange("title", e.target.value)}
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
          onChange={(e) => onChange("description", e.target.value)}
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
          onChange={(e) => onChange("price", e.target.value)}
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
          onChange={(e) => onChange("category", e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default ProductBasicForm;