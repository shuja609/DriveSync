import React, { useState, useEffect } from 'react';
import interactionService from '../../../services/interactionService';
import { formatDate } from '../../../utils/dateUtils';
import { FiShoppingCart, FiCalendar, FiMessageCircle, FiClock, FiTag, FiArrowRight } from 'react-icons/fi';

const InteractionHistory = ({ customerId }) => {
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchInteractions = async () => {
            try {
                setLoading(true);
                const response = await interactionService.getCustomerInteractions(customerId);
                if (response.success) {
                    setInteractions(response.data.interactions);
                } else {
                    setError('Failed to fetch interactions');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch interactions');
            } finally {
                setLoading(false);
            }
        };

        if (customerId) {
            fetchInteractions();
        }
    }, [customerId]);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'order':
                return <FiShoppingCart className="w-5 h-5" />;
            case 'booking':
                return <FiCalendar className="w-5 h-5" />;
            case 'inquiry':
                return <FiMessageCircle className="w-5 h-5" />;
            default:
                return null;
        }
    };

    const getBadgeColor = (type) => {
        switch (type) {
            case 'order':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'booking':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'inquiry':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getFilterButtonClass = (buttonFilter) => {
        const baseClass = "px-4 py-2 rounded-lg font-medium transition-colors";
        if (filter === buttonFilter) {
            switch (buttonFilter) {
                case 'order':
                    return `${baseClass} bg-emerald-100 text-emerald-800`;
                case 'booking':
                    return `${baseClass} bg-blue-100 text-blue-800`;
                case 'inquiry':
                    return `${baseClass} bg-purple-100 text-purple-800`;
                default:
                    return `${baseClass} bg-primary-light text-white`;
            }
        }
        return `${baseClass} text-gray-600 hover:bg-gray-100`;
    };

    const filteredInteractions = filter === 'all' 
        ? interactions 
        : interactions.filter(interaction => interaction.type === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-center">{error}</p>
            </div>
        );
    }

    if (!interactions.length) {
        return (
            <div className="p-8 text-center">
                <div className="mb-4">
                    <FiClock className="w-12 h-12 mx-auto text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No interaction history available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex space-x-2 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={getFilterButtonClass('all')}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('order')}
                    className={getFilterButtonClass('order')}
                >
                    Orders
                </button>
                <button
                    onClick={() => setFilter('booking')}
                    className={getFilterButtonClass('booking')}
                >
                    Bookings
                </button>
                <button
                    onClick={() => setFilter('inquiry')}
                    className={getFilterButtonClass('inquiry')}
                >
                    Inquiries
                </button>
            </div>

            {/* Interactions List */}
            <div className="space-y-4">
                {filteredInteractions.map((interaction) => (
                    <div
                        key={interaction.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="p-4">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${getBadgeColor(interaction.type)}`}>
                                        {getTypeIcon(interaction.type)}
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(interaction.type)}`}>
                                            {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FiClock className="w-4 h-4 mr-1" />
                                    {formatDate(interaction.date)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                {interaction.vehicle && (
                                    <div className="flex items-center space-x-2">
                                        <FiTag className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-900 font-medium">
                                            {interaction.vehicle.title}
                                        </span>
                                    </div>
                                )}
                                <p className="text-gray-600">{interaction.notes}</p>
                            </div>

                            {/* Footer */}
                            <div className="mt-4 flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(interaction.status)}`}>
                                    {interaction.status.charAt(0).toUpperCase() + interaction.status.slice(1)}
                                </span>
                                <div className="flex items-center text-primary-light hover:text-primary-dark">
                                    <span className="text-sm font-medium">{interaction.nextAction}</span>
                                    <FiArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InteractionHistory; 