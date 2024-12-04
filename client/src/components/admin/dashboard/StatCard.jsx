import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({ title, value, change, icon, trend }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-light p-6 rounded-lg shadow-lg"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-text-primary/70 text-sm">{title}</p>
                    <h3 className="text-2xl font-bold text-text-primary mt-1">
                        {value}
                    </h3>
                </div>
                <div className="p-3 bg-background-dark/50 rounded-lg">
                    {icon}
                </div>
            </div>

            <div className="flex items-center mt-4">
                {trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${
                    trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                    {change}
                </span>
                <span className="text-text-primary/50 text-sm ml-2">
                    vs last month
                </span>
            </div>
        </motion.div>
    );
};

export default StatCard; 