import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    NotificationsNone,
    NotificationsActive,
    Circle,
    CarRental,
    Message,
    Info
} from '@mui/icons-material';

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // Sample notifications (replace with actual data from backend)
    useEffect(() => {
        // Simulated notifications
        const sampleNotifications = [
            {
                id: 1,
                type: 'car',
                title: 'Price Drop Alert',
                message: 'Tesla Model S price dropped by $5,000',
                read: false,
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                link: '/cars/tesla-model-s'
            },
            {
                id: 2,
                type: 'message',
                title: 'New Message',
                message: 'You have a new message from John Doe',
                read: false,
                timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                link: '/messages/123'
            },
            {
                id: 3,
                type: 'system',
                title: 'Welcome to DriveSync',
                message: 'Complete your profile to get personalized recommendations',
                read: true,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
                link: '/profile/settings'
            }
        ];

        setNotifications(sampleNotifications);
        setUnreadCount(sampleNotifications.filter(n => !n.read).length);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'car':
                return <CarRental className="w-5 h-5" />;
            case 'message':
                return <Message className="w-5 h-5" />;
            case 'system':
                return <Info className="w-5 h-5" />;
            default:
                return <Circle className="w-5 h-5" />;
        }
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-background-light focus:outline-none"
            >
                {unreadCount > 0 ? (
                    <>
                        <NotificationsActive className="w-6 h-6 text-primary-light" />
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                            {unreadCount}
                        </span>
                    </>
                ) : (
                    <NotificationsNone className="w-6 h-6 text-text-primary" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-background-light rounded-md shadow-lg overflow-hidden z-50"
                    >
                        <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-text-primary">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs text-text-primary/70">
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <Link
                                        key={notification.id}
                                        to={notification.link}
                                        className={`block px-4 py-3 hover:bg-background-dark border-b border-gray-700 ${
                                            !notification.read ? 'bg-background-dark/50' : ''
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex items-start">
                                            <span className="flex-shrink-0 mt-1 mr-3 text-primary-light">
                                                {getIcon(notification.type)}
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-text-primary">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-text-primary/70 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-text-primary/50 mt-1">
                                                    {formatTime(notification.timestamp)}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <span className="flex-shrink-0 ml-3">
                                                    <Circle className="w-2 h-2 text-primary-light" />
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-text-primary/70">
                                    No notifications
                                </div>
                            )}
                        </div>

                        <Link
                            to="/profile/notifications"
                            className="block px-4 py-3 text-sm text-center text-primary-light hover:bg-background-dark border-t border-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            View All Notifications
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationsDropdown; 