import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import SalesChart from './charts/SalesChart';
import UserMetrics from './metrics/UserMetrics';
import VehicleMetrics from './metrics/VehicleMetrics';
import RevenueMetrics from './metrics/RevenueMetrics';
import PerformanceMetrics from './metrics/PerformanceMetrics';
import analyticsService from '../../../services/analyticsService';
import Button from '../../common/Button';

const AnalyticsDashboard = () => {
    const [timeRange, setTimeRange] = useState('month');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const response = await analyticsService.getAnalytics(timeRange);
            setData(response);
            setError(null);
        } catch (err) {
            setError('Failed to load analytics data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExportData = async (format) => {
        try {
            const response = await analyticsService.exportData(timeRange, format);
            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analytics_${timeRange}_${new Date().toISOString()}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-lg">{error}</div>
                <button 
                    onClick={fetchAnalyticsData}
                    className="mt-4 px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-primary">Analytics & Reports</h1>
                
                <div className="flex items-center space-x-4">
                    {/* Time Range Selector */}
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-background-light text-text-primary px-4 py-2 rounded-lg border border-background-dark"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>

                    {/* Export Buttons */}
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => handleExportData('csv')}
                            className="flex items-center space-x-2"
                        >
                            <FiDownload />
                            <span>CSV</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleExportData('pdf')}
                            className="flex items-center space-x-2"
                        >
                            <FiDownload />
                            <span>PDF</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <UserMetrics data={data?.userMetrics} />
                <VehicleMetrics data={data?.vehicleMetrics} />
                <RevenueMetrics data={data?.revenueMetrics} />
                <PerformanceMetrics data={data?.performanceMetrics} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-background-light p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Sales Overview</h2>
                    <SalesChart data={data?.salesData} />
                </div>
                <div className="bg-background-light p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Revenue Trends</h2>
                    <SalesChart data={data?.revenueData} type="revenue" />
                </div>
            </div>

            {/* Additional Metrics and Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Selling Vehicles */}
                <div className="bg-background-light p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Top Selling Vehicles</h2>
                    {data?.topVehicles?.map((vehicle, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-background-dark last:border-0">
                            <span className="text-text-primary">{vehicle.name}</span>
                            <span className="text-text-primary">{vehicle.sales}</span>
                        </div>
                    ))}
                </div>

                {/* Customer Demographics */}
                <div className="bg-background-light p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Customer Demographics</h2>
                    {data?.demographics?.map((demo, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-background-dark last:border-0">
                            <span className="text-text-primary">{demo.category}</span>
                            <span className="text-text-primary">{demo.percentage}%</span>
                        </div>
                    ))}
                </div>

                {/* Sales by Region */}
                <div className="bg-background-light p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Sales by Region</h2>
                    {data?.regionalSales?.map((region, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-background-dark last:border-0">
                            <span className="text-text-primary">{region.name}</span>
                            <span className="text-text-primary">${region.sales.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard; 