import React from 'react';
import { motion } from 'framer-motion';
import { 
    Person, 
    DirectionsCar, 
    ShoppingCart,
    Check,
    Warning 
} from '@mui/icons-material';

const activities = [
    {
        type: 'user',
        message: 'New user registration',
        user: 'John Doe',
        time: '5 minutes ago',
        icon: <Person />,
        status: 'success'
    },
    {
        type: 'order',
        message: 'New order placed',
        user: 'Jane Smith',
        time: '15 minutes ago',
        icon: <ShoppingCart />,
        status: 'success'
    },
    {
        type: 'vehicle',
        message: 'New vehicle listed',
        user: 'Admin',
        time: '1 hour ago',
        icon: <DirectionsCar />,
        status: 'pending'
    }
];

const RecentActivity = () => {
    return (
        <div className="bg-background-light p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
                Recent Activity
            </h2>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-background-dark rounded-lg"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-background-light rounded-lg">
                                {activity.icon}
                            </div>
                            <div>
                                <p className="text-text-primary">
                                    {activity.message}
                                </p>
                                <p className="text-sm text-text-primary/70">
                                    by {activity.user}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-text-primary/50">
                                {activity.time}
                            </span>
                            {activity.status === 'success' ? (
                                <Check className="text-green-500" />
                            ) : (
                                <Warning className="text-yellow-500" />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity; 