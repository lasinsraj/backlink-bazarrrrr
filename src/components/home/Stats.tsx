import { motion } from "framer-motion";
import { TrendingUp, Users, Award, Shield } from "lucide-react";

const Stats = () => {
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "1000+", label: "Active Users", delay: 0.2 },
    { icon: <TrendingUp className="w-8 h-8" />, value: "5000+", label: "Backlinks Sold", delay: 0.4 },
    { icon: <Award className="w-8 h-8" />, value: "98%", label: "Success Rate", delay: 0.6 },
    { icon: <Shield className="w-8 h-8" />, value: "24/7", label: "Support", delay: 0.8 }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Trusted by Digital Marketers Worldwide
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: stat.delay + 0.2 }}
                className="flex justify-center text-primary mb-4"
              >
                {stat.icon}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: stat.delay + 0.4 }}
                className="text-3xl font-bold text-primary mb-2"
              >
                {stat.value}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: stat.delay + 0.6 }}
                className="text-gray-600"
              >
                {stat.label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;