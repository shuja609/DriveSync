import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiCalendar, FiTrendingUp, FiTrendingDown, FiShoppingBag, FiMessageSquare, FiStar } from 'react-icons/fi';
import dashboardService from '../../../services/dashboardService';

const StatCard = ({ icon: Icon, title, value, trend }) => {
    const isTrendPositive = parseFloat(trend) >= 0;
    
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-background-dark p-6 rounded-xl shadow-lg"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-text-primary/70">{title}</p>
                    <h3 className="text-2xl font-bold text-text-primary mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-background-light rounded-lg">
                    <Icon className="w-6 h-6 text-primary-light" />
                </div>
            </div>
            <div className="mt-4 flex items-center">
                {isTrendPositive ? (
                    <FiTrendingUp className="text-green-500 mr-1" />
                ) : (
                    <FiTrendingDown className="text-red-500 mr-1" />
                )}
                <span className={isTrendPositive ? "text-sm text-green-500" : "text-sm text-red-500"}>
                    {trend}% this month
                </span>
            </div>
        </motion.div>
    );
};

const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'order':
                return FiShoppingBag;
            case 'inquiry':
                return FiMessageSquare;
            case 'booking':
                return FiCalendar;
            default:
                return FiStar;
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const activityDate = new Date(date);
        const diffInSeconds = Math.floor((now - activityDate) / 1000);
        
        if (diffInSeconds < 60) {
            return 'just now';
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
        
        // If more than 7 days, show the date
        return activityDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: activityDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const Icon = getActivityIcon(activity.type);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-background-light rounded-lg"
        >
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-background-dark rounded-lg">
                    <Icon className="w-5 h-5 text-primary-light" />
                </div>
                <div>
                    <h3 className="font-medium text-text-primary">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </h3>
                    <p className="text-sm text-text-primary/70">
                        {activity.userName} - {activity.vehicleName}
                    </p>
                </div>
            </div>
            <span className="text-sm text-text-primary/70">
                {formatTimeAgo(activity.date)}
            </span>
        </motion.div>
    );
};

const SalesDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dashboardService.getDashboardStats();
                setDashboardData(response.data);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error fetching dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                <p>Error: {error}</p>
            </div>
        );
    }

    const stats = [
        {
            icon: FiUsers,
            title: 'Total Customers',
            value: dashboardData.totals.users.toLocaleString(),
            trend: dashboardData.trends.users
        },
        {
            icon: FiShoppingBag,
            title: 'Total Orders',
            value: dashboardData.totals.orders.toLocaleString(),
            trend: dashboardData.trends.orders
        },
        {
            icon: FiCalendar,
            title: 'Total Bookings',
            value: dashboardData.totals.bookings.toLocaleString(),
            trend: dashboardData.trends.bookings
        },
        {
            icon: FiMessageSquare,
            title: 'Total Inquiries',
            value: dashboardData.totals.inquiries.toLocaleString(),
            trend: dashboardData.trends.inquiries
        }
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Sales Dashboard</h1>
                <p className="text-text-primary/70">Overview of your sales performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-background-dark rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {dashboardData.recentActivities.map((activity, index) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard; 