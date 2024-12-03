import React from 'react';
import { motion } from 'framer-motion';
import { 
  Speed, 
  Security, 
  Analytics, 
  CloudSync, 
  Support, 
  Inventory 
} from '@mui/icons-material';

const features = [
  {
    icon: <Speed className="w-12 h-12" />,
    title: "Fast Performance",
    description: "Lightning-fast inventory management with real-time updates and seamless synchronization."
  },
  {
    icon: <Security className="w-12 h-12" />,
    title: "Enhanced Security",
    description: "Bank-grade security protocols ensuring your data remains protected at all times."
  },
  {
    icon: <Analytics className="w-12 h-12" />,
    title: "Advanced Analytics",
    description: "Comprehensive analytics and reporting tools to track sales, inventory, and performance."
  },
  {
    icon: <CloudSync className="w-12 h-12" />,
    title: "Cloud Integration",
    description: "Seamless cloud synchronization allowing access to your data from anywhere."
  },
  {
    icon: <Support className="w-12 h-12" />,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you with any queries or concerns."
  },
  {
    icon: <Inventory className="w-12 h-12" />,
    title: "Smart Inventory",
    description: "Intelligent inventory management with predictive stocking suggestions."
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const Features = () => {
  return (
    <section className="py-24 bg-background-dark relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-default to-background-dark opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light to-secondary-light text-transparent bg-clip-text">
            Powerful Features
          </h2>
          <p className="text-text-primary/80 text-lg max-w-2xl mx-auto">
            Experience the next generation of showroom management with our cutting-edge features
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative hover:cursor-pointer bg-background-light/50 backdrop-blur-sm rounded-xl p-6 hover:bg-background-light transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light/10 to-secondary-light/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative z-10"
              >
                <div className="text-primary-light mb-4 transform group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-text-primary/70">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 