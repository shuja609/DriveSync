import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import orderService from '../../services/orderService';
import ProfileLayout from '../profile/ProfileLayout';

const OrderCard = ({ order, onExpand, isExpanded }) => {
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-background-dark rounded-lg shadow-md overflow-hidden"
        >
            <div className="relative">
                {order.vehicleId?.media?.find(media => media.isPrimary) && (
                    <img
                        src={order.vehicleId.media.find(media => media.isPrimary).url}
                        alt={`${order.vehicleId.brand} ${order.vehicleId.model}`}
                        className="w-full h-48 object-cover"
                    />
                )}
                <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                        {order.vehicleId?.brand} {order.vehicleId?.model}
                    </h3>
                    <p className="text-sm text-text-primary/70">
                        Order #{order.orderNumber}
                    </p>
                </div>

                <div className="space-y-2 mb-4">
                    <p className="text-text-primary">
                        <span className="font-semibold">Amount:</span> ${order.amount?.toFixed(2)}
                    </p>
                    <p className="text-text-primary">
                        <span className="font-semibold">Order Date:</span>{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0 }}
                    className="overflow-hidden"
                >
                    {isExpanded && (
                        <div className="space-y-3 pt-4 border-t border-gray-200">
                            <p className="text-text-primary">
                                <span className="font-semibold">Payment Status:</span>{' '}
                                {order.paymentDetails?.status}
                            </p>
                            {order.shippingDetails && (
                                <div>
                                    <span className="font-semibold">Shipping Address:</span>
                                    <p className="text-sm text-text-primary/70">
                                        {order.shippingDetails.address.street}<br />
                                        {order.shippingDetails.address.city}, {order.shippingDetails.address.state} {order.shippingDetails.address.zipCode}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                <div className="flex justify-between items-center mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onExpand(!isExpanded)}
                        className="text-primary-light hover:text-primary-dark transition-colors flex items-center"
                    >
                        <FiChevronDown
                            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                        <span className="ml-1">{isExpanded ? 'Less Details' : 'More Details'}</span>
                    </motion.button>
                    <Link
                        to={`/orders/${order._id}`}
                        className="inline-block bg-primary-light text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

const SkeletonCard = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
    >
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
        <div className="p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
            <div className="flex justify-end">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
            </div>
        </div>
    </motion.div>
);

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderService.getUserOrders();
            setOrders(response.data || []);
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to fetch orders', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders
        .filter(order => {
            if (statusFilter === 'all') return true;
            return order.status === statusFilter;
        })
        .filter(order => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return (
                order.orderNumber.toLowerCase().includes(searchLower) ||
                order.vehicleId?.brand.toLowerCase().includes(searchLower) ||
                order.vehicleId?.model.toLowerCase().includes(searchLower)
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'amount':
                    return b.amount - a.amount;
                default:
                    return 0;
            }
        });

    const renderContent = () => {
        if (loading) {
            return (
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            );
        }

        if (orders.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <h2 className="text-xl text-text-primary mb-4">No Orders Found</h2>
                    <p className="text-text-primary/70 mb-6">You haven't placed any orders yet.</p>
                    <Link
                        to="/showroom"
                        className="inline-block bg-primary-light text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Browse Vehicles
                    </Link>
                </motion.div>
            );
        }

        if (filteredOrders.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <h2 className="text-xl text-text-primary mb-4">No Matching Orders</h2>
                    <p className="text-text-primary/70">Try adjusting your filters or search terms</p>
                </motion.div>
            );
        }

        return (
            <motion.div layout className="grid gap-6 md:grid-cols-2">
                <AnimatePresence>
                    {filteredOrders.map((order, index) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            isExpanded={expandedOrderId === order._id}
                            onExpand={(expanded) => setExpandedOrderId(expanded ? order._id : null)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <ProfileLayout title="My Orders">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Filters and Search */}
                <div className="flex flex-wrap gap-4 items-center justify-between bg-background-dark p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-background-dark text-primary-light rounded-lg"
                        >
                            <FiFilter />
                            Filters
                        </motion.button>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/80" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg  text-black/80 focus:outline-none focus:ring-2 focus:ring-primary-light"
                            />
                        </div>
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border rounded-lg  text-black/80 focus:outline-none focus:ring-2 focus:ring-primary-light"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="amount">Sort by Amount</option>
                    </select>
                </div>

                <AnimatePresence>
                    {filterOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-background-dark p-4 rounded-lg shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Filter Orders</h3>
                                <button
                                    onClick={() => setFilterOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FiX />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                {['all', 'pending', 'processing', 'confirmed', 'completed', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            statusFilter === status
                                                ? 'bg-primary-light text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {renderContent()}
            </motion.div>
        </ProfileLayout>
    );
};

export default MyOrders; 