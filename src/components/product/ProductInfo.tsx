import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, DollarSign, Award, TrendingUp } from "lucide-react";

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
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <p className="text-2xl font-bold text-primary mb-4">
          <DollarSign className="inline-block h-6 w-6 mr-1" />
          ${product.price}
        </p>
      </div>

      <div className="prose max-w-none">
        <p className="text-gray-600">{product.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.features?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-slate-700">
            <Award className="h-5 w-5 text-primary" />
            <span>{feature}</span>
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