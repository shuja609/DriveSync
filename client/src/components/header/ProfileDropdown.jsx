import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUser, 
    FiSettings, 
    FiMail, 
    FiBell, 
    FiHeart,
    FiClock,
    FiHelpCircle,
    FiLogOut,
    FiShoppingBag
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        {
            icon: <FiUser className="w-5 h-5" />,
            label: 'Profile Overview',
            path: '/profile'
        },
        {
            icon: <FiSettings className="w-5 h-5" />,
            label: 'Account Settings',
            path: '/profile/settings'
        },
        {
            icon: <FiMail className="w-5 h-5" />,
            label: 'Email Settings',
            path: '/profile/emails'
        },
        {
            icon: <FiBell className="w-5 h-5" />,
            label: 'Notifications',
            path: '/profile/notifications'
        },
        {
            icon: <FiShoppingBag className="w-5 h-5" />,
            label: 'My Orders',
            path: '/orders'
        },
        {
            icon: <FiHeart className="w-5 h-5" />,
            label: 'Saved Cars',
            path: '/profile/saved'
        },
        {
            icon: <FiClock className="w-5 h-5" />,
            label: 'Activity History',
            path: '/profile/activity'
        },
        {
            icon: <FiHelpCircle className="w-5 h-5" />,
            label: 'Support',
            path: '/profile/support'
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                        src={user?.profilePicture || '/default-avatar.png'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-background-light rounded-md shadow-lg py-1 z-50"
                    >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-700">
                            <p className="text-sm text-text-primary font-medium">
                                {user?.name?.first} {user?.name?.last}
                            </p>
                            <p className="text-xs text-text-primary/70 truncate">
                                {user?.email}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className="flex items-center space-x-3 px-4 py-2 text-text-primary hover:bg-background-dark transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="border-t border-background-dark pt-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-background-dark transition-colors"
                            >
                                <FiLogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown; 