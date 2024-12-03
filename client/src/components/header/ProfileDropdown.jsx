import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Person, 
    Settings, 
    Email, 
    Notifications, 
    Favorite,
    History,
    Help,
    ExitToApp 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: <Person />, label: 'View Profile', link: '/profile' },
        { icon: <Settings />, label: 'Account Settings', link: '/profile/settings' },
        { icon: <Email />, label: 'Email Settings', link: '/profile/emails' },
        { icon: <Notifications />, label: 'Notifications', link: '/profile/notifications' },
        { icon: <Favorite />, label: 'Saved Cars', link: '/profile/saved' },
        { icon: <History />, label: 'My Activity', link: '/profile/activity' },
        { icon: <Help />, label: 'Help & Support', link: '/profile/support' },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                        src={user.profilePicture || '/default-avatar.png'}
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
                                {user.name}
                            </p>
                            <p className="text-xs text-text-primary/70 truncate">
                                {user.email}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.link}
                                    className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-background-dark"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="w-5 h-5 mr-3">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}

                            <button
                                onClick={logout}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-background-dark"
                            >
                                <ExitToApp className="w-5 h-5 mr-3" />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown; 