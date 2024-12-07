import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import { motion } from 'framer-motion';

const Header = () => {
    const { user, isAuthenticated } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 bg-background-default/95 backdrop-blur-sm z-50 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary-light">
                            DriveSync
                        </span>
                    </Link>

                    {/* Navigation
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-text-primary hover:text-primary-light">
                            Home
                        </Link>
                        <Link to="/cars" className="text-text-primary hover:text-primary-light">
                            Cars
                        </Link>
                        <Link to="/about" className="text-text-primary hover:text-primary-light">
                            About
                        </Link>
                        <Link to="/contact" className="text-text-primary hover:text-primary-light">
                            Contact
                        </Link>
                    </nav> */}

                    {/* Auth Section */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <motion.div 
                                className="flex items-center space-x-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <NotificationsDropdown />
                                <ProfileDropdown user={user} />
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="flex items-center space-x-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Link 
                                    to="/login"
                                    className="text-text-primary hover:text-primary-light"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register"
                                    className="bg-primary-light text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                                >
                                    Register
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 