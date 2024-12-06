import React from 'react';
import { FiUsers, FiUserPlus, FiUserCheck } from 'react-icons/fi';

const UserMetrics = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-background-light p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">User Metrics</h3>
                <FiUsers className="text-2xl text-primary-light" />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiUsers className="text-text-primary" />
                        <span className="text-text-primary">Total Users</span>
                    </div>
                    <span className="text-text-primary font-semibold">{data.totalUsers}</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiUserPlus className="text-green-500" />
                        <span className="text-text-primary">New Users</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-text-primary font-semibold">{data.newUsers}</span>
                        <span className="text-green-500 text-sm ml-2">+{data.growthRate}%</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiUserCheck className="text-blue-500" />
                        <span className="text-text-primary">Active Users</span>
                    </div>
                    <span className="text-text-primary font-semibold">{data.activeUsers}</span>
                </div>

                {/* Progress bar for user engagement */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-primary/70">User Engagement</span>
                        <span className="text-text-primary">{data.engagementRate}%</span>
                    </div>
                    <div className="h-2 bg-background-dark rounded-full">
                        <div 
                            className="h-full bg-primary-light rounded-full"
                            style={{ width: `${data.engagementRate}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserMetrics; 