import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FiHome,
    FiUsers,
    FiTruck,
    FiShoppingCart,
    FiBarChart2,
    FiVideo,
    FiSettings
} from 'react-icons/fi';

const menuItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/admin' },
    { icon: <FiUsers />, label: 'Users', path: '/admin/users' },
    { icon: <FiTruck />, label: 'Vehicles', path: '/admin/vehicles' },
    { icon: <FiShoppingCart />, label: 'Orders', path: '/admin/orders' },
    { icon: <FiBarChart2 />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <FiVideo />, label: 'Content', path: '/admin/content' },
    { icon: <FiSettings />, label: 'Settings', path: '/admin/settings' }
];

const AdminSidebar = () => {
    return (
        <aside className="w-64 bg-background-light min-h-screen p-4">
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center space-x-3 px-4 py-3 rounded-lg
                            transition-colors duration-200
                            ${isActive 
                                ? 'bg-primary-light text-white' 
                                : 'text-text-primary hover:bg-background-dark'
                            }
                        `}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar; 