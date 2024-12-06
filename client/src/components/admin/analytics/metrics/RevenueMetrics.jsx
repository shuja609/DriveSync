import React from 'react';
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiTrendingUp } from 'react-icons/fi';

const RevenueMetrics = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-background-light p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Revenue Metrics</h3>
                <FiDollarSign className="text-2xl text-primary-light" />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiDollarSign className="text-text-primary" />
                        <span className="text-text-primary">Total Revenue</span>
                    </div>
                    <span className="text-text-primary font-semibold">
                        ${data.totalRevenue.toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        {data.revenueChange >= 0 ? (
                            <FiArrowUpRight className="text-green-500" />
                        ) : (
                            <FiArrowDownRight className="text-red-500" />
                        )}
                        <span className="text-text-primary">Monthly Change</span>
                    </div>
                    <div className="flex items-center">
                        <span className={`font-semibold ${
                            data.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {data.revenueChange >= 0 ? '+' : ''}{data.revenueChange}%
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiTrendingUp className="text-blue-500" />
                        <span className="text-text-primary">Average Order Value</span>
                    </div>
                    <span className="text-text-primary font-semibold">
                        ${data.averageOrderValue.toLocaleString()}
                    </span>
                </div>

                {/* Revenue Target Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-primary/70">Target Progress</span>
                        <span className="text-text-primary">{data.targetProgress}%</span>
                    </div>
                    <div className="h-2 bg-background-dark rounded-full">
                        <div 
                            className={`h-full rounded-full ${
                                data.targetProgress >= 100 ? 'bg-green-500' :
                                data.targetProgress >= 75 ? 'bg-primary-light' :
                                data.targetProgress >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(data.targetProgress, 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueMetrics; 