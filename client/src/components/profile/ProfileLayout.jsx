import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FiUser,
    FiSettings,
    FiMail,
    FiBell,
    FiHeart,
    FiClock,
    FiHelpCircle,
    FiShoppingBag
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

    return (
        <div className="min-h-screen bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
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

                    {/* Main Content */}
                    <div className="flex-1 bg-background-light rounded-lg p-6">
                        <h1 className="text-2xl font-bold text-text-primary mb-6">
                            {title}
                        </h1>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout; 