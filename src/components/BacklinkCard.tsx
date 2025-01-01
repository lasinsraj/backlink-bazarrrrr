import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface BacklinkCardProps {
  id: string;
  title: string;
  domain: string;
  da: number;
  dr: number;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  isSponsored?: boolean;
}

const BacklinkCard = ({
  id,
  title,
  domain,
  da,
  dr,
  price,
  rating,
  reviews,
  description,
  image,
  isSponsored = false,
}: BacklinkCardProps) => {
  const navigate = useNavigate();

  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className={`bg-card rounded-lg border p-6 transition-all duration-200 hover:shadow-lg animate-[fade-in_0.2s_ease-out] ${isSponsored ? 'border-primary/20' : ''}`}>
      {isSponsored && (
        <div className="text-xs font-medium text-primary mb-2">
          Sponsored
        </div>
      )}
      
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
        <img 
          src={image || defaultImage} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-2">{domain}</p>
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{description}</p>
      
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
        <Button onClick={() => navigate(`/product/${generateSlug(title)}`)}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export default BacklinkCard;
