import React from 'react';
import { FiActivity, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const PerformanceMetrics = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-background-light p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Performance</h3>
                <FiActivity className="text-2xl text-primary-light" />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiCheckCircle className="text-green-500" />
                        <span className="text-text-primary">Success Rate</span>
                    </div>
                    <span className="text-text-primary font-semibold">{data.successRate}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiClock className="text-blue-500" />
                        <span className="text-text-primary">Avg. Response Time</span>
                    </div>
                    <span className="text-text-primary font-semibold">{data.avgResponseTime}ms</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FiAlertCircle className="text-yellow-500" />
                        <span className="text-text-primary">Error Rate</span>
                    </div>
                    <span className="text-text-primary font-semibold">{data.errorRate}%</span>
                </div>

                {/* System Health */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-primary/70">System Health</span>
                        <span className="text-text-primary">{data.systemHealth}%</span>
                    </div>
                    <div className="h-2 bg-background-dark rounded-full">
                        <div 
                            className={`h-full rounded-full ${
                                data.systemHealth >= 90 ? 'bg-green-500' :
                                data.systemHealth >= 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`}
                            style={{ width: `${data.systemHealth}%` }}
                        />
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {data.services.map((service, index) => (
                        <div 
                            key={index}
                            className="flex items-center justify-between p-2 bg-background-dark rounded-lg"
                        >
                            <span className="text-sm text-text-primary">{service.name}</span>
                            <span className={`h-2 w-2 rounded-full ${
                                service.status === 'operational' ? 'bg-green-500' :
                                service.status === 'degraded' ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PerformanceMetrics; 