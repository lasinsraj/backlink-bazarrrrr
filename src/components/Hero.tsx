import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 animate-[fade-in_0.2s_ease-out]">
          Premium Quality Backlinks
          <br />
          <span className="text-primary">for Your Website</span>
        </h1>
        
        <h2 className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-[fade-in_0.2s_ease-out_0.1s]">
          AI-powered backlink marketplace with high-quality, verified domains and real-time metrics
        </h2>
        
        <div className="max-w-2xl mx-auto relative animate-[fade-in_0.2s_ease-out_0.2s]">
          <div className="flex items-center bg-white rounded-lg shadow-lg border p-2">
            <Search className="h-5 w-5 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Search for backlinks by domain, niche, or metrics..."
              className="flex-1 px-4 py-3 outline-none text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button size="lg" onClick={handleSearch}>Search</Button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3 animate-[fade-in_0.2s_ease-out_0.3s]">
            {['DA 50+', 'Tech Blogs', 'News Sites', 'Guest Posts'].map((tag) => (
              <Button
                key={tag}
                variant="secondary"
                size="sm"
                className="hover:scale-105 transition-transform duration-200"
                onClick={() => setSearchQuery(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;