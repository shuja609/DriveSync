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
    FiMessageSquare
} from 'react-icons/fi';

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

const AdminSidebar = () => {
    return (
        <aside className="w-64 bg-background-light min-h-screen p-4">
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <div key={item.path}>
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
                        >
                            {item.icon}
                            <span>{item.label}</span>
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
                                    >
                                        {subItem.label}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar; 