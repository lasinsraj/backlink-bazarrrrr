import { motion } from "framer-motion";
import { Shield, TrendingUp, Award, Users, Clock, Search } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Verified Domains",
      description: "All domains are manually verified for quality and authenticity",
      delay: 0.2
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "High Authority",
      description: "Access premium domains with excellent DA/PA metrics",
      delay: 0.4
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee with our quality assurance process",
      delay: 0.6
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Expert Support",
      description: "Dedicated team to help you choose the right backlinks",
      delay: 0.8
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Fast Delivery",
      description: "Quick turnaround time for all backlink placements",
      delay: 1.0
    },
    {
      icon: <Search className="w-12 h-12" />,
      title: "Transparent Metrics",
      description: "Clear domain metrics and performance indicators",
      delay: 1.2
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Why Choose Our Backlinks?
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: feature.delay + 0.2 }}
                className="text-primary mb-6"
              >
                {feature.icon}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: feature.delay + 0.4 }}
                className="text-xl font-semibold mb-4"
              >
                {feature.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: feature.delay + 0.6 }}
                className="text-gray-600"
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;