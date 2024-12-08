import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FormatQuote,
  Star,
  NavigateBefore,
  NavigateNext 
} from '@mui/icons-material';

const testimonials = [
  {
    id: 1,
    name: "John Anderson",
    role: "Fleet Manager",
    company: "Enterprise Motors",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2Zlc3Npb25hbCUyMHBob3RvcyUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    rating: 5,
    quote: "DriveSync has revolutionized how we manage our showroom. The analytics and real-time tracking features are game-changers."
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Sales Director",
    company: "Luxury Automobiles",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwcGhvdG9zJTIwcGVvcGxlfGVufDB8fDB8fHww",
    rating: 5,
    quote: "The cloud integration and mobile accessibility have made our operations seamless. Customer service is exceptional!"
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Dealership Owner",
    company: "Premium Cars",
    image: "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHByb2Zlc3Npb25hbCUyMHBob3RvcyUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    rating: 5,
    quote: "Since implementing DriveSync, our sales have increased by 40%. The inventory management system is simply outstanding."
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setActiveIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-background-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-default to-background-dark opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-light/20 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light to-secondary-light text-transparent bg-clip-text">
            Client Success Stories
          </h2>
          <p className="text-text-primary/80 text-lg max-w-2xl mx-auto">
            Hear from our satisfied customers about their experience with DriveSync
          </p>
        </motion.div>

        <div className="relative h-[500px] max-w-4xl mx-auto">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full"
            >
              <div className="bg-background-light/30 backdrop-blur-lg rounded-2xl p-8 md:p-12">
                <FormatQuote className="text-primary-light w-16 h-16 mb-6 opacity-50" />
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-light/20">
                    <img 
                      src={testimonials[activeIndex].image} 
                      alt={testimonials[activeIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xl md:text-2xl text-text-primary mb-6 italic">
                      "{testimonials[activeIndex].quote}"
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                        <Star key={i} className="text-primary-light w-6 h-6" />
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-text-primary">
                      {testimonials[activeIndex].name}
                    </h3>
                    <p className="text-primary-light">
                      {testimonials[activeIndex].role}
                    </p>
                    <p className="text-text-primary/60">
                      {testimonials[activeIndex].company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="p-2 rounded-full bg-background-light/30 backdrop-blur-sm hover:bg-background-light/50 transition-colors"
            >
              <NavigateBefore className="text-text-primary w-8 h-8" />
            </motion.button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeIndex 
                      ? 'bg-primary-light' 
                      : 'bg-text-primary/20 hover:bg-text-primary/40'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="p-2 rounded-full bg-background-light/30 backdrop-blur-sm hover:bg-background-light/50 transition-colors"
            >
              <NavigateNext className="text-text-primary w-8 h-8" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 