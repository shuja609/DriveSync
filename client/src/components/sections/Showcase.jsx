import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Speed, 
  LocalGasStation, 
  Settings 
} from '@mui/icons-material';

const cars = [
  {
    id: 1,
    name: "Tesla Model S",
    category: "Electric",
    price: "$89,990",
    specs: {
      speed: "2.4s 0-60 mph",
      range: "405 miles",
      power: "1,020 hp"
    },
    image: "/images/cars/Tesla-Model-S.jpg"
  },
  {
    id: 2,
    name: "Porsche 911 GT3",
    category: "Sports",
    price: "$169,700",
    specs: {
      speed: "3.2s 0-60 mph",
      range: "290 miles",
      power: "502 hp"
    },
    image: "/images/hero-bg.jpg"
  },
  {
    id: 3,
    name: "BMW iX",
    category: "Electric SUV",
    price: "$84,100",
    specs: {
      speed: "4.6s 0-60 mph",
      range: "324 miles",
      power: "516 hp"
    },
    image: "/images/hero-bg.jpg"
  },
  {
    id: 4,
    name: "Mercedes-AMG GT",
    category: "Luxury Sports",
    price: "$118,600",
    specs: {
      speed: "3.1s 0-60 mph",
      range: "280 miles",
      power: "577 hp"
    },
    image: "/images/hero-bg.jpg"
  },
  {
    id: 5,
    name: "Lucid Air",
    category: "Electric",
    price: "$87,400",
    specs: {
      speed: "3.0s 0-60 mph",
      range: "516 miles",
      power: "800 hp"
    },
    image: "/images/hero-bg.jpg"
  }
];

const Showcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCar = () => {
    setActiveIndex((prev) => (prev + 1) % cars.length);
  };

  const prevCar = () => {
    setActiveIndex((prev) => (prev - 1 + cars.length) % cars.length);
  };

  return (
    <section className="py-24 bg-background-default relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light to-secondary-light text-transparent bg-clip-text">
            Featured Vehicles
          </h2>
          <p className="text-text-primary/80 text-lg max-w-2xl mx-auto">
            Discover our exclusive collection of premium vehicles
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video rounded-xl overflow-hidden"
            >
              <img
                src={cars[activeIndex].image}
                alt={cars[activeIndex].name}
                className="w-full h-full object-cover"
              />
              
              {/* Car Info Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background-dark/90 to-transparent p-8"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-3xl font-bold text-text-primary mb-2">
                      {cars[activeIndex].name}
                    </h3>
                    <p className="text-primary-light text-lg mb-4">
                      {cars[activeIndex].category}
                    </p>
                    <div className="flex space-x-6">
                      <div className="flex items-center">
                        <Speed className="text-secondary-light mr-2" />
                        <span className="text-text-primary/80">
                          {cars[activeIndex].specs.speed}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <LocalGasStation className="text-secondary-light mr-2" />
                        <span className="text-text-primary/80">
                          {cars[activeIndex].specs.range}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Settings className="text-secondary-light mr-2" />
                        <span className="text-text-primary/80">
                          {cars[activeIndex].specs.power}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-primary-light">
                    {cars[activeIndex].price}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevCar}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background-dark/50 hover:bg-background-dark/80 p-2 rounded-full backdrop-blur-sm transition-all duration-300"
          >
            <ChevronLeft className="text-text-primary w-8 h-8" />
          </button>
          <button
            onClick={nextCar}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background-dark/50 hover:bg-background-dark/80 p-2 rounded-full backdrop-blur-sm transition-all duration-300"
          >
            <ChevronRight className="text-text-primary w-8 h-8" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Showcase; 