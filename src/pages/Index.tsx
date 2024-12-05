import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturedProducts />
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <motion.div 
          className="container mx-auto px-4"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            Trusted by Digital Marketers Worldwide
          </motion.h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1000+", label: "Active Users" },
              { number: "5000+", label: "Backlinks Sold" },
              { number: "98%", label: "Success Rate" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
                variants={fadeInUp}
              >
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <motion.div 
          className="container mx-auto px-4"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            Why Choose Our Backlinks?
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-primary" />,
                title: "Verified Domains",
                description: "All domains are manually verified for quality and authenticity"
              },
              {
                icon: <TrendingUp className="h-12 w-12 text-primary" />,
                title: "High Authority",
                description: "Access premium domains with excellent DA/PA metrics"
              },
              {
                icon: <Award className="h-12 w-12 text-primary" />,
                title: "Quality Guarantee",
                description: "100% satisfaction guarantee with our quality assurance process"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                variants={fadeInUp}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-app text-white">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-6"
            variants={fadeInUp}
          >
            Ready to Boost Your SEO?
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Join thousands of satisfied customers who have improved their search rankings with our premium backlinks.
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <Button 
              onClick={() => navigate('/shop')}
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              Browse All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <motion.div 
          className="container mx-auto px-4"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            What Our Customers Say
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "John Smith",
                role: "SEO Manager",
                content: "The quality of backlinks exceeded my expectations. Saw significant improvement in rankings within months."
              },
              {
                name: "Sarah Johnson",
                role: "Digital Marketer",
                content: "Excellent service and support. The team helped me choose the perfect backlinks for my niche."
              },
              {
                name: "Mike Wilson",
                role: "Website Owner",
                content: "Best investment for my website's SEO. The results speak for themselves."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg bg-white shadow-lg border"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-4">
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;