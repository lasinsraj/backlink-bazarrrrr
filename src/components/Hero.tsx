import { Search } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Find the Perfect Backlinks for Your Website
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          AI-powered backlink marketplace with high-quality, verified domains and real-time metrics
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <div className="flex items-center bg-white rounded-lg shadow-sm border p-2">
            <Search className="h-5 w-5 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Search for backlinks by domain, niche, or metrics..."
              className="flex-1 px-4 py-2 outline-none"
            />
            <Button>Search</Button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button variant="secondary" size="sm">DA 50+</Button>
            <Button variant="secondary" size="sm">Tech Blogs</Button>
            <Button variant="secondary" size="sm">News Sites</Button>
            <Button variant="secondary" size="sm">Guest Posts</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;