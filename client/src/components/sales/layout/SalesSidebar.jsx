import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiHome, 
    FiUsers, 
    FiFileText,
    FiSettings,
    FiMenu,
    FiX,
    FiMessageSquare,
    FiShoppingCart,
    FiTag,
    FiMessageCircle
} from 'react-icons/fi';

const menuItems = [
    { path: '/sales/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/sales/customers', icon: FiUsers, label: 'Customers' },
    { path: '/sales/orders', icon: FiShoppingCart, label: 'Orders' },
    { path: '/sales/quotations', icon: FiFileText, label: 'Quotations' },
    { path: '/sales/inquiries', icon: FiMessageSquare, label: 'Inquiries' },
    { path: '/sales/discounts', icon: FiTag, label: 'Discounts' },
    { path: '/sales/feedback', icon: FiMessageCircle, label: 'Feedback' },
    { path: '/sales/settings', icon: FiSettings, label: 'Settings' }
    
];

const SalesSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const NavItem = ({ item }) => {
        const isActive = location.pathname === item.path;
        return (
            <Link to={item.path}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
                        isActive
                            ? 'bg-primary-light text-white'
                            : 'text-text-primary hover:bg-background-light'
                    }`}
                >
                    <item.icon className="w-5 h-5" />
                    {(isOpen || isMobileOpen) && (
                        <span className="ml-3">{item.label}</span>
                    )}
                </motion.div>
            </Link>
        );
    };

    // Mobile menu button
    const MobileMenuButton = () => (
        <button
            onClick={toggleMobileSidebar}
            className="lg:hidden fixed top-4 left-4 z-0 p-2 rounded-lg bg-background-dark text-text-primary"
        >
            {!isMobileOpen ? <FiMenu size={24} /> : <FiX size={24} />}
        </button>
    );

    return (
        <>
            <MobileMenuButton />
            
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? '240px' : '80px' }}
                className="hidden lg:block bg-background-dark h-screen fixed left-0 top-0 overflow-y-auto shadow-lg"
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        {isOpen && <h1 className="text-xl font-bold text-text-primary">Sales Panel</h1>}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-background-light text-text-primary"
                        >
                            <FiMenu size={24} />
                        </button>
                    </div>
                    <nav>
                        {menuItems.map((item, index) => (
                            <NavItem key={index} item={item} />
                        ))}
                    </nav>
                </div>
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black lg:hidden"
                            onClick={toggleMobileSidebar}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween' }}
                            className="fixed left-0 top-0 h-screen w-64 bg-background-dark z-40 lg:hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="text-xl font-bold text-text-primary ">Sales Panel</h1>
                                    <button
                                        onClick={toggleMobileSidebar}
                                        className="p-2 rounded-lg hover:bg-background-light text-text-primary"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                                <nav>
                                    {menuItems.map((item, index) => (
                                        <NavItem key={index} item={item} />
                                    ))}
                                </nav>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default SalesSidebar; 