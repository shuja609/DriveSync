import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUser,
    FiSettings,
    FiMail,
    FiBell,
    FiHeart,
    FiClock,
    FiHelpCircle,
    FiShoppingBag,
    FiMenu,
    FiX
} from 'react-icons/fi';

const menuItems = [
    { icon: <FiUser className="w-5 h-5" />, label: 'Profile Overview', path: '/profile' },
    { icon: <FiSettings className="w-5 h-5" />, label: 'Account Settings', path: '/profile/settings' },
    { icon: <FiMail className="w-5 h-5" />, label: 'Email Settings', path: '/profile/emails' },
    { icon: <FiBell className="w-5 h-5" />, label: 'Notifications', path: '/profile/notifications' },
    { icon: <FiShoppingBag className="w-5 h-5" />, label: 'My Orders', path: '/orders' },
    { icon: <FiHeart className="w-5 h-5" />, label: 'Saved Cars', path: '/profile/saved' },
    { icon: <FiClock className="w-5 h-5" />, label: 'My Activity', path: '/profile/activity' },
    { icon: <FiHelpCircle className="w-5 h-5" />, label: 'Help & Support', path: '/profile/support' }
];

const ProfileLayout = ({ children, title }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-background-dark">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-primary-light rounded-lg text-white hover:bg-primary-dark transition-colors"
                >
                    {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </button>
            </div>

            <div className="flex">
                {/* Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeSidebar}
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <motion.div
                    className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-background-dark z-50 transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:z-0 shadow-lg lg:shadow-none`}
                    initial={false}
                >
                    <div className="h-full overflow-y-auto py-8 px-4">
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeSidebar}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        location.pathname === item.path
                                            ? 'bg-primary-light text-white'
                                            : 'text-text-primary hover:bg-background-light'
                                    }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 min-h-screen lg:pl-8">
                    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-6">
                                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                                    {title}
                                </h1>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout; 