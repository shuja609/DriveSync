import React from 'react';
import { 
    People, 
    DirectionsCar, 
    ShoppingCart, 
    TrendingUp 
} from '@mui/icons-material';
import StatCard from './StatCard';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
    const stats = [
        {
            title: 'Total Users',
            value: '1,234',
            change: '+12%',
            icon: <People className="text-blue-500" />,
            trend: 'up'
        },
        {
            title: 'Vehicles Listed',
            value: '567',
            change: '+8%',
            icon: <DirectionsCar className="text-green-500" />,
            trend: 'up'
        },
        {
            title: 'Total Orders',
            value: '89',
            change: '+23%',
            icon: <ShoppingCart className="text-purple-500" />,
            trend: 'up'
        },
        {
            title: 'Revenue',
            value: '$123.4K',
            change: '+18%',
            icon: <TrendingUp className="text-yellow-500" />,
            trend: 'up'
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Activity */}
            <RecentActivity />
        </div>
    );
};

export default Dashboard; 