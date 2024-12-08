import React from 'react';
import { Outlet } from 'react-router-dom';
import SalesHeader from './SalesHeader';
import SalesSidebar from './SalesSidebar';

const SalesLayout = () => {
    return (
        <div className="min-h-screen bg-background">
            <SalesSidebar />
            <div className="lg:ml-[240px]">
                <SalesHeader />
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SalesLayout; 