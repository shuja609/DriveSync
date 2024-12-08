import React from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiMail, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SalesHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-background-dark shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Left side - Welcome message */}
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
                            Welcome back, {user?.name?.first || 'Sales Representative'}
                        </h2>
                        <p className="text-sm text-text-primary/70">
                            {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>

                    {/* Right side - Quick actions */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-2 text-text-primary hover:bg-background-light rounded-lg transition-colors"
                        >
                            <FiBell className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-primary-light rounded-full"></span>
                        </motion.button>

                        {/* Messages */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-2 text-text-primary hover:bg-background-light rounded-lg transition-colors"
                        >
                            <FiMail className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-primary-light rounded-full"></span>
                        </motion.button>

                        {/* Profile */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-3 p-2 text-text-primary hover:bg-background-light rounded-lg transition-colors cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}+${user?.role}&background=5d9adf&color=000000`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="hidden sm:block">{user?.name || 'User'}</span>
                        </motion.div>

                        {/* Logout Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center space-x-2 p-2 text-primary-light hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                        >
                            <FiLogOut className="w-6 h-6" />
                            <span className="hidden ">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SalesHeader; 