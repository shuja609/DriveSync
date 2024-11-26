import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out";
  const variants = {
    primary: "bg-gradient-to-r from-primary-light to-primary-dark text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    secondary: "bg-gradient-to-r from-secondary-light to-secondary-dark text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    outline: "border-2 border-primary-light text-primary-light hover:bg-primary-light/10"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button; 