import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorPage = ({ error }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
    >
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-2xl"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <ExclamationTriangleIcon className="h-20 w-20 text-red-500" />
        </motion.div>
        
        <motion.h1 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          Oops!
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xl text-gray-700 mb-4">Something went wrong</p>
          <p className="text-gray-500 mb-8 px-4">
            {error?.message || 'An unexpected error occurred'}
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                         text-white rounded-lg font-semibold shadow-lg hover:shadow-xl 
                         transition-all duration-200 ease-in-out"
            >
              Go Back Home
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ErrorPage; 