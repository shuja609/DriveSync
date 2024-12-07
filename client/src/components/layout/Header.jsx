import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu as MenuIcon } from '@mui/icons-material';
import Button from '../common/Button';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background-default/95 backdrop-blur-sm z-50 ">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
          >
            <i className="fas fa-car-side text-2xl text-primary-light" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-secondary-light text-transparent bg-clip-text">
              DriveSync
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="px-4 py-2">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" className="px-4 py-2">Register</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 space-y-2"
          >
            <Link to="/login">
              <Button variant="outline" fullWidth>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" fullWidth>Register</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 