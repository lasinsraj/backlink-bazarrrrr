import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturedProducts />
      
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 animate-fade-in">Why Choose Our Backlinks?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "High Authority",
                description: "Access premium domains with high DA/PA metrics",
                image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              },
              {
                title: "Secure Transactions",
                description: "Safe and reliable payment processing",
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              },
              {
                title: "Expert Support",
                description: "24/7 customer support for all your needs",
                image: "https://images.unsplash.com/photo-1488882467328-5f3cf24903f9"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => navigate('/shop')}
            size="lg"
            className="mt-12 animate-fade-in"
            style={{ animationDelay: '600ms' }}
          >
            Browse All Products <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;