import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

interface BacklinkCardProps {
  title: string;
  domain: string;
  da: number;
  dr: number;
  price: number;
  rating: number;
  reviews: number;
  isSponsored?: boolean;
}

const BacklinkCard = ({
  title,
  domain,
  da,
  dr,
  price,
  rating,
  reviews,
  isSponsored = false,
}: BacklinkCardProps) => {
  return (
    <div className={`bg-card rounded-lg border p-6 transition-all duration-200 hover:shadow-lg animate-fade-in ${isSponsored ? 'border-primary/20' : ''}`}>
      {isSponsored && (
        <div className="text-xs font-medium text-primary mb-2">
          Sponsored
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{domain}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-2 bg-slate-50 rounded">
          <div className="text-lg font-semibold">DA {da}</div>
          <div className="text-xs text-slate-500">Domain Authority</div>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded">
          <div className="text-lg font-semibold">DR {dr}</div>
          <div className="text-xs text-slate-500">Domain Rating</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-sm text-slate-500">({reviews})</span>
        </div>
        <div className="text-lg font-bold text-success">
          ${price}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <ThumbsUp className="h-4 w-4 mr-1" />
            Like
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Review
          </Button>
        </div>
        <Button>View Details</Button>
      </div>
    </div>
  );
};

export default BacklinkCard;