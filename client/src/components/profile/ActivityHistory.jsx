import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Visibility, 
    Favorite, 
    Compare,
    Search,
    DirectionsCar
} from '@mui/icons-material';
import ProfileLayout from './ProfileLayout';
import profileService from '../../services/profileService';

const getActivityIcon = (type) => {
    switch (type) {
        case 'view':
            return <Visibility className="text-primary-light" />;
        case 'save':
            return <Favorite className="text-primary-light" />;
        case 'compare':
            return <Compare className="text-primary-light" />;
        case 'search':
            return <Search className="text-primary-light" />;
        default:
            return <DirectionsCar className="text-primary-light" />;
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const ActivityHistory = () => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const response = await profileService.getActivityHistory();
            setActivities(response.activities || []);
        } catch (err) {
            setError('Failed to load activity history');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProfileLayout title="Activity History">
                <div className="flex justify-center items-center h-64">
                    <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin" />
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout title="Activity History">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                {error && (
                    <div className="text-red-500 text-center p-4 mb-6">
                        {error}
                    </div>
                )}

                {activities.length === 0 ? (
                    <div className="text-center py-12">
                        <DirectionsCar className="w-16 h-16 text-text-primary/30 mx-auto mb-4" />
                        <p className="text-text-primary/70">
                            No activity recorded yet. Start exploring cars!
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-light/20" />

                        {/* Activity items */}
                        <div className="space-y-8">
                            {activities.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative flex items-center ${
                                        index % 2 === 0 ? 'justify-start' : 'justify-end'
                                    }`}
                                >
                                    {/* Activity content */}
                                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                                        <div className="bg-background-dark p-4 rounded-lg shadow-lg">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="p-2 rounded-full bg-background-light">
                                                    {getActivityIcon(activity.type)}
                                                </span>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-text-primary">
                                                        {activity.car?.name || 'Unknown Car'}
                                                    </h3>
                                                    <p className="text-sm text-text-primary/70">
                                                        {formatDate(activity.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-text-primary/80">
                                                {activity.type === 'view' && 'Viewed car details'}
                                                {activity.type === 'save' && 'Saved to favorites'}
                                                {activity.type === 'compare' && 'Added to comparison'}
                                                {activity.type === 'search' && `Searched for "${activity.metadata?.query}"`}
                                            </p>
                                            {activity.car && (
                                                <button
                                                    onClick={() => window.location.href = `/cars/${activity.car.id}`}
                                                    className="mt-2 text-sm text-primary-light hover:text-primary-dark"
                                                >
                                                    View Car →
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timeline dot */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-light rounded-full" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </ProfileLayout>
    );
};

export default ActivityHistory; 