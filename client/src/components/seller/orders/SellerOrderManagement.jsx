import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiMessageSquare, FiDollarSign, FiTruck } from 'react-icons/fi';
import { 
    getOrders,
    updateOrderStatus,
    updatePaymentStatus,
    updateDeliveryStatus,
    addOrderNote,
    uploadOrderDocument,
    updateFinancingDetails
} from '../../../services/sellerOrderService';

const SellerOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentType, setDocumentType] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        paymentStatus: 'all',
        deliveryStatus: 'all'
    });

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const queryFilters = {};
            if (filters.status !== 'all') queryFilters.status = filters.status;
            if (filters.paymentStatus !== 'all') queryFilters.paymentStatus = filters.paymentStatus;
            if (filters.deliveryStatus !== 'all') queryFilters.deliveryStatus = filters.deliveryStatus;
            
            const response = await getOrders(queryFilters);
            setOrders(response.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handlePaymentStatusChange = async (orderId, newStatus) => {
        try {
            await updatePaymentStatus(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const handleDeliveryStatusChange = async (orderId, newStatus) => {
        try {
            await updateDeliveryStatus(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            console.error('Error updating delivery status:', error);
        }
    };

    const handleAddNote = async (orderId) => {
        if (!noteText.trim()) return;
        
        try {
            await addOrderNote(orderId, noteText);
            setNoteText('');
            fetchOrders();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleFileUpload = async (orderId) => {
        if (!selectedFile || !documentType) return;

        try {
            await uploadOrderDocument(orderId, documentType, selectedFile);
            setSelectedFile(null);
            setDocumentType('');
            fetchOrders();
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500';
            case 'processing': return 'bg-blue-500';
            case 'confirmed': return 'bg-green-500';
            case 'cancelled': return 'bg-red-500';
            case 'completed': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-primary">Order Management</h1>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full sm:w-auto p-2 border rounded-lg focus:outline-none text-black/80 focus:ring-2 focus:ring-primary-light"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={filters.paymentStatus}
                        onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                        className="w-full sm:w-auto p-2 border rounded-lg focus:outline-none text-black/80 focus:ring-2 focus:ring-primary-light"
                    >
                        <option value="all">All Payment Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                    <select
                        value={filters.deliveryStatus}
                        onChange={(e) => setFilters(prev => ({ ...prev, deliveryStatus: e.target.value }))}
                        className="w-full sm:w-auto p-2 border rounded-lg focus:outline-none text-black/80 focus:ring-2 focus:ring-primary-light"
                    >
                        <option value="all">All Delivery Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-4">No orders found</div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-3 sm:p-4 rounded-lg shadow"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-base sm:text-lg text-primary-light">Order #{order.orderNumber}</h3>
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm ${getStatusColor(order.status)}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm sm:text-base text-gray-600">
                                                Customer: {order.userId.name.first} {order.userId.name.last}
                                            </p>
                                            <p className="text-sm sm:text-base text-gray-600">
                                                Vehicle: {order.vehicleId.make} {order.vehicleId.model} {order.vehicleId.year}
                                            </p>
                                            <p className="text-sm sm:text-base text-gray-600">
                                                Amount: ${order.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <FiDollarSign className="text-primary-light" />
                                                <select
                                                    value={order.paymentDetails.status}
                                                    onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                                                    className="flex-1 p-1 text-sm border border-primary-light rounded text-black/80"
                                                >
                                                    <option value="pending">Payment Pending</option>
                                                    <option value="completed">Payment Completed</option>
                                                    <option value="failed">Payment Failed</option>
                                                    <option value="refunded">Payment Refunded</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiTruck className="text-primary-light" />
                                                <select
                                                    value={order.shippingDetails.deliveryStatus}
                                                    onChange={(e) => handleDeliveryStatusChange(order._id, e.target.value)}
                                                    className="flex-1 p-1 text-sm border border-primary-light rounded text-black/80"
                                                >
                                                    <option value="pending">Delivery Pending</option>
                                                    <option value="in_transit">In Transit</option>
                                                    <option value="delivered">Delivered</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedOrder?._id === order._id && (
                                        <div className="mt-4 space-y-4">
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <input
                                                    type="text"
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    placeholder="Add a note..."
                                                    className="flex-1 p-2 text-sm border border-primary-light rounded-lg text-black/80"
                                                />
                                                <button
                                                    onClick={() => handleAddNote(order._id)}
                                                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                                >
                                                    <FiMessageSquare />
                                                </button>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <select
                                                    value={documentType}
                                                    onChange={(e) => setDocumentType(e.target.value)}
                                                    className="flex-1 p-2 text-sm border border-primary-light rounded-lg text-black/80"
                                                >
                                                    <option value="">Select Document Type</option>
                                                    <option value="purchase_agreement">Purchase Agreement</option>
                                                    <option value="invoice">Invoice</option>
                                                    <option value="insurance">Insurance</option>
                                                    <option value="registration">Registration</option>
                                                    <option value="financing_agreement">Financing Agreement</option>
                                                </select>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                                        className="hidden"
                                                        id={`file-upload-${order._id}`}
                                                    />
                                                    <label
                                                        htmlFor={`file-upload-${order._id}`}
                                                        className="p-2 bg-gray-100 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-200"
                                                    >
                                                        <FiUpload />
                                                    </label>
                                                    {selectedFile && (
                                                        <button
                                                            onClick={() => handleFileUpload(order._id)}
                                                            className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                                        >
                                                            Upload
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="w-full sm:w-auto p-2 text-sm border border-primary-light rounded-lg text-black/80"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <button
                                            onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                                            className="w-full sm:w-auto px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
                                        >
                                            {selectedOrder?._id === order._id ? 'Close' : 'Manage'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerOrderManagement;