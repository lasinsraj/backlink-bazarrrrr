import { Product } from "@/types";

interface ProductSummaryProps {
  product: Product;
}

const ProductSummary = ({ product }: ProductSummaryProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <div className="text-xl font-bold text-primary">${product.price}</div>
    </div>
  );
};

export default ProductSummary;