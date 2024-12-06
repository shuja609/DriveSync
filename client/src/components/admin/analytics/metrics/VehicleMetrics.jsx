import React from 'react';
import { FiTruck, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const VehicleMetrics = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-background-light p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Vehicle Metrics</h3>
                <FiTruck className="text-2xl text-primary-light" />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiTruck className="text-text-primary" />
                        <span className="text-text-primary">Total Vehicles</span>
                    </div>
                    <span className="text-text-primary font-semibold">{data.totalVehicles}</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiDollarSign className="text-green-500" />
                        <span className="text-text-primary">Average Price</span>
                    </div>
                    <span className="text-text-primary font-semibold">
                        ${data.averagePrice.toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiTrendingUp className="text-blue-500" />
                        <span className="text-text-primary">Sales Rate</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-text-primary font-semibold">{data.salesRate}%</span>
                        <span className={`text-sm ml-2 ${
                            data.salesTrend > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {data.salesTrend > 0 ? '+' : ''}{data.salesTrend}%
                        </span>
                    </div>
                </div>

                {/* Inventory Status */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-primary/70">Inventory Status</span>
                        <span className="text-text-primary">{data.inventoryLevel}%</span>
                    </div>
                    <div className="h-2 bg-background-dark rounded-full">
                        <div 
                            className={`h-full rounded-full ${
                                data.inventoryLevel > 70 ? 'bg-green-500' :
                                data.inventoryLevel > 30 ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`}
                            style={{ width: `${data.inventoryLevel}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleMetrics; 