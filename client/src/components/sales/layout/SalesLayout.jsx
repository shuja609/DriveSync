import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SalesHeader from './SalesHeader';
import SalesSidebar from './SalesSidebar';

const SalesLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-background w-full max-w-[100vw] overflow-x-hidden">
            {/* Mobile sidebar backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 z-30 h-full transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:static lg:z-0`}>
                <SalesSidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-[240px] max-w-full">
                <SalesHeader onMenuClick={toggleSidebar} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SalesLayout;