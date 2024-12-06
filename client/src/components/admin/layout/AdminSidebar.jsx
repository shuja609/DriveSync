import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FiHome,
    FiUsers,
    FiTruck,
    FiShoppingCart,
    FiBarChart2,
    FiVideo,
    FiSettings,
    FiDollarSign,
    FiMessageSquare,
    FiX
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { IconButton } from '@mui/material';

const menuItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/admin' },
    { icon: <FiUsers />, label: 'Users', path: '/admin/users' },
    { icon: <FiTruck />, label: 'Vehicles', path: '/admin/vehicles' },
    {
        icon: <FiDollarSign />,
        label: 'Sales',
        path: '/admin/sales',
        subItems: [
            { label: 'Orders', path: '/admin/sales/orders' },
            { label: 'Transactions', path: '/admin/sales/transactions' }
        ]
    },
    { icon: <FiBarChart2 />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <FiVideo />, label: 'Content', path: '/admin/content' },
    { icon: <FiMessageSquare />, label: 'Feedback', path: '/admin/feedback' },
    { icon: <FiSettings />, label: 'Settings', path: '/admin/settings' }
];

const AdminSidebar = ({ onClose }) => {
    const { user } = useAuth();
    return (
        <aside className="w-64 bg-background-light min-h-screen flex flex-col shadow-lg">
            {/* Mobile Close Button */}
            <div className="lg:hidden p-4 flex justify-end">
                <IconButton onClick={onClose} size="small" className="text-white">
                    <FiX className="text-white" />
                </IconButton>
            </div>

            {/* Logo */}
            <div className="p-4 border-b border-background-dark">
                <h1 className="text-2xl font-bold text-primary-light">DriveSync</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {menuItems.map((item) => (
                    <div key={item.path} className="relative">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center space-x-3 px-4 py-3 rounded-lg
                                transition-colors duration-200
                                ${isActive 
                                    ? 'bg-primary-light text-white' 
                                    : 'text-text-primary hover:bg-background-dark'
                                }
                            `}
                            onClick={item.subItems ? undefined : onClose}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                        {item.subItems && (
                            <div className="ml-8 mt-1 space-y-1">
                                {item.subItems.map((subItem) => (
                                    <NavLink
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={({ isActive }) => `
                                            block px-4 py-2 rounded-lg text-sm
                                            transition-colors duration-200
                                            ${isActive 
                                                ? 'bg-primary-light/10 text-primary-light' 
                                                : 'text-text-primary hover:bg-background-dark'
                                            }
                                        `}
                                        onClick={onClose}
                                    >
                                        {subItem.label}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-background-dark">
                <div className="flex items-center space-x-3">
                    <div className="w-auto h-auto rounded-full bg-primary-light/20 flex items-center justify-center">
                        <FiUsers className="text-primary-light" />
                    </div>
                    <div>
                        <p className="font-medium text-primary-light">{user?.name || 'Admin User'}</p>
                        <p className="text-sm text-primary-light">{user?.email || 'admin@drivesync.com'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar; 