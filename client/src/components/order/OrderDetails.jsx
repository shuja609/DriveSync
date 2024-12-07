import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiChevronDown, FiTruck, FiDollarSign, FiClock, FiFileText } from 'react-icons/fi';
import orderService from '../../services/orderService';
import ProfileLayout from '../profile/ProfileLayout';
import PaymentForm from '../payment/PaymentForm';

const DetailsCard = ({ title, icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-background-dark rounded-lg shadow-md overflow-hidden"
        >
            <motion.button
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between"
            >
                <div className="flex items-center space-x-3">
                    {icon}
                    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FiChevronDown className="w-5 h-5" />
                </motion.div>
            </motion.button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 border-t border-gray-100">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
        </div>
    </div>
);

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await orderService.getOrderById(id);
            setOrder(response.data);
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to fetch order details', { variant: 'error' });
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentData) => {
        setShowPaymentForm(false);
        await fetchOrderDetails();
    };

    const getStatusColor = (status) => {
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

    const renderContent = () => {
        if (loading) {
            return (
                <div className="space-y-6">
                    {[1, 2, 3, 4].map(i => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            );
        }

        if (!order) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Order Not Found</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/orders')}
                        className="bg-primary-light text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Back to Orders
                    </motion.button>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
            >
                {/* Order Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background-dark p-6 rounded-lg shadow-md"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">
                                Order #{order.orderNumber}
                            </h1>
                            <p className="text-text-primary/70">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                            >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </motion.span>
                            {order.status === 'pending' && !showPaymentForm && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowPaymentForm(true)}
                                    className="px-4 py-1 bg-primary-light text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                                >
                                    Pay Now
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Payment Form */}
                <AnimatePresence>
                    {showPaymentForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <PaymentForm
                                order={order}
                                onSuccess={handlePaymentSuccess}
                                onCancel={() => setShowPaymentForm(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Vehicle Information */}
                <DetailsCard
                    title="Vehicle Information"
                    icon={<FiTruck className="w-6 h-6 text-primary-light " />}
                >
                    <div className="space-y-4 bg-background-dark">
                        {order.vehicleId?.media?.find(media => media.isPrimary) && (
                            <motion.img
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={order.vehicleId.media.find(media => media.isPrimary).url}
                                alt={`${order.vehicleId.brand} ${order.vehicleId.model}`}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        )}
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">
                                {order.vehicleId?.brand} {order.vehicleId?.model}
                            </h3>
                            <p className="text-text-primary/70">Year: {order.vehicleId?.year}</p>
                        </div>
                    </div>
                </DetailsCard>

                {/* Payment Information */}
                <DetailsCard
                    title="Payment Information"
                    icon={<FiDollarSign className="w-6 h-6 text-primary-light" />}
                >
                    <div className="space-y-3">
                        <div>
                            <span className="font-semibold">Amount:</span>{' '}
                            ${order.amount?.toFixed(2)}
                        </div>
                        <div>
                            <span className="font-semibold">Payment Method:</span>{' '}
                            {order.paymentDetails?.method}
                        </div>
                        <div>
                            <span className="font-semibold">Payment Status:</span>{' '}
                            <span className={`px-2 py-1 rounded-full text-sm ${
                                order.paymentDetails?.status === 'completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {order.paymentDetails?.status}
                            </span>
                        </div>
                    </div>
                </DetailsCard>

                {/* Shipping Information */}
                {order.shippingDetails && (
                    <DetailsCard
                        title="Shipping Information"
                        icon={<FiTruck className="w-6 h-6 text-primary-light" />}
                    >
                        <div className="space-y-3">
                            <div>
                                <span className="font-semibold">Address:</span><br />
                                {order.shippingDetails.address.street}<br />
                                {order.shippingDetails.address.city}, {order.shippingDetails.address.state} {order.shippingDetails.address.zipCode}<br />
                                {order.shippingDetails.address.country}
                            </div>
                            {order.shippingDetails.deliveryDate && (
                                <div>
                                    <span className="font-semibold">Expected Delivery:</span>{' '}
                                    {new Date(order.shippingDetails.deliveryDate).toLocaleDateString()}
                                </div>
                            )}
                            <div>
                                <span className="font-semibold">Delivery Status:</span>{' '}
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    order.shippingDetails.deliveryStatus === 'delivered'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {order.shippingDetails.deliveryStatus}
                                </span>
                            </div>
                        </div>
                    </DetailsCard>
                )}

                {/* Order Timeline */}
                <DetailsCard
                    title="Order Timeline"
                    icon={<FiClock className="w-6 h-6 text-primary-light" />}
                >
                    <div className="space-y-4">
                        {order.timeline?.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start"
                            >
                                <div className="w-2 h-2 mt-2 rounded-full bg-primary-light"></div>
                                <div className="ml-4">
                                    <p className="font-semibold text-text-primary">
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </p>
                                    <p className="text-sm text-text-primary/70">
                                        {new Date(event.timestamp).toLocaleString()}
                                    </p>
                                    {event.description && (
                                        <p className="text-sm text-text-primary mt-1">
                                            {event.description}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </DetailsCard>

                {/* Documents */}
                {order.documents?.length > 0 && (
                    <DetailsCard
                        title="Documents"
                        icon={<FiFileText className="w-6 h-6 text-primary-light" />}
                    >
                        <div className="space-y-3">
                            {order.documents.map((doc, index) => (
                                <motion.a
                                    key={index}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 rounded-lg border border-gray-200 hover:border-primary-light transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{doc.type.replace('_', ' ').toUpperCase()}</span>
                                        <span className="text-sm text-text-primary/70">
                                            {new Date(doc.uploadedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </DetailsCard>
                )}
            </motion.div>
        );
    };

    return (
        <ProfileLayout title="Order Details">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <motion.div
                    whileHover={{ x: -5 }}
                    className="mb-6"
                >
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center text-primary-light hover:text-primary-dark transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Back to Orders
                    </button>
                </motion.div>

                {renderContent()}
            </motion.div>
        </ProfileLayout>
    );
};

export default OrderDetails; 