import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, DollarSign, Award, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductInfoProps {
  product: {
    title: string;
    description: string;
    price: number;
    category: string;
    features?: string[];
  };
  onBuyClick: () => void;
}

const ProductInfo = ({ product, onBuyClick }: ProductInfoProps) => {
  // Format description to add proper spacing
  const formattedDescription = product.description?.split('\n').map((paragraph, index) => (
    <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
  ));

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <p className="text-xl md:text-2xl font-bold text-primary mb-4">
          <DollarSign className="inline-block h-6 w-6 mr-1" />
          ${product.price}
        </p>
      </div>

      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="prose max-w-none">
          {formattedDescription}
        </div>
      </ScrollArea>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {product.features?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-3 rounded-lg">
            <Award className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Button 
        size="lg" 
        className="w-full md:w-auto"
        onClick={onBuyClick}
      >
        Purchase Now
      </Button>
    </div>
  );
};

export default ProductInfo;