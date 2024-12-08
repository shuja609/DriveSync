import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiEdit2, FiTrash2, FiMoreVertical, FiAlertTriangle, FiMessageSquare } from 'react-icons/fi';
import EditCustomerModal from './EditCustomerModal';
import InteractionHistory from './InteractionHistory';
import customerService from '../../../services/customerService';
import { toast } from 'react-toastify';

const DeleteConfirmationModal = ({ customer, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative bg-background-dark rounded-xl shadow-xl w-full max-w-md p-6 z-10"
            >
                <div className="flex items-center mb-4 text-red-500">
                    <FiAlertTriangle className="w-6 h-6 mr-2" />
                    <h2 className="text-xl font-semibold">Delete Customer</h2>
                </div>
                <p className="text-text-primary mb-6">
                    Are you sure you want to delete customer{' '}
                    <span className="font-semibold">
                        {customer.name?.first} {customer.name?.last}
                    </span>
                    ? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="px-4 py-2 text-text-primary hover:bg-background-light rounded-lg transition-colors"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

const CustomerCard = ({ customer, viewMode, onRefresh }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInteractionModal, setShowInteractionModal] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await customerService.deleteCustomer(customer._id);
            toast.success('Customer deleted successfully');
            onRefresh();
        } catch (error) {
            toast.error('Failed to delete customer');
            console.error(error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const getStatusColor = (status = 'pending') => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-500';
            case 'inactive':
                return 'bg-red-500';
            case 'pending':
            default:
                return 'bg-yellow-500';
        }
    };

    if (viewMode === 'grid') {
        return (
            <>
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-background-dark rounded-xl shadow-lg overflow-hidden"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                    <div className="relative p-6">
                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4 flex items-center">
                            <span className={`w-3 h-3 rounded-full ${getStatusColor(customer.status)} mr-2`}></span>
                            <span className="text-sm text-text-primary/70 capitalize">{customer.status || 'Pending'}</span>
                        </div>

                        {/* Customer Info */}
                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-background-light mr-4">
                                <img
                                    src={customer.profilePicture || '/default-avatar.png'}
                                    alt={`${customer.name?.first || ''} ${customer.name?.last || ''}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary">
                                    {customer.name?.first || ''} {customer.name?.last || 'Unknown User'}
                                </h3>
                                <p className="text-sm text-text-primary/70">ID: {customer._id?.slice(-6) || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-text-primary/70">
                                <FiMail className="w-4 h-4 mr-2" />
                                <span className="text-sm">{customer.email || 'No email'}</span>
                            </div>
                            <div className="flex items-center text-text-primary/70">
                                <FiPhone className="w-4 h-4 mr-2" />
                                <span className="text-sm">{customer.phone || 'No phone'}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-2 mt-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowInteractionModal(true)}
                                className="p-2 text-text-primary hover:bg-background-light rounded-lg transition-colors"
                            >
                                <FiMessageSquare className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowEditModal(true)}
                                className="p-2 text-text-primary hover:bg-background-light rounded-lg transition-colors"
                            >
                                <FiEdit2 className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowDeleteModal(true)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <FiTrash2 className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Modals */}
                <AnimatePresence>
                    {showEditModal && (
                        <EditCustomerModal
                            customer={customer}
                            onClose={() => setShowEditModal(false)}
                            onSuccess={onRefresh}
                        />
                    )}
                    {showDeleteModal && (
                        <DeleteConfirmationModal
                            customer={customer}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={handleDelete}
                        />
                    )}
                    {showInteractionModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                            <div className="bg-background-dark rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Interaction History</h2>
                                    <button
                                        onClick={() => setShowInteractionModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                                <InteractionHistory customerId={customer._id} />
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <>
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-background-dark rounded-lg shadow-md overflow-hidden"
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-background-light mr-4">
                            <img
                                src={customer.profilePicture || '/default-avatar.png'}
                                alt={`${customer.name?.first || ''} ${customer.name?.last || ''}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-text-primary truncate">
                                {customer.name?.first || ''} {customer.name?.last || 'Unknown User'}
                            </h3>
                            <div className="flex items-center text-text-primary/70 text-sm">
                                <FiMail className="w-4 h-4 mr-2" />
                                <span className="truncate">{customer.email || 'No email'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full ${getStatusColor(customer.status)} mr-2`}></span>
                            <span className="text-sm text-text-primary/70 capitalize">{customer.status || 'Pending'}</span>
                        </div>
                        
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowActions(!showActions)}
                                className="p-2 text-text-primary hover:bg-background-light rounded-lg transition-colors"
                            >
                                <FiMoreVertical className="w-5 h-5" />
                            </motion.button>
                            
                            <AnimatePresence>
                                {showActions && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-background-dark rounded-lg shadow-lg py-2 z-10"
                                    >
                                        <button
                                            onClick={() => {
                                                setShowInteractionModal(true);
                                                setShowActions(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-text-primary hover:bg-background-light transition-colors flex items-center"
                                        >
                                            <FiMessageSquare className="w-4 h-4 mr-2" />
                                            View Interactions
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowEditModal(true);
                                                setShowActions(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-text-primary hover:bg-background-light transition-colors flex items-center"
                                        >
                                            <FiEdit2 className="w-4 h-4 mr-2" />
                                            Edit Customer
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDeleteModal(true);
                                                setShowActions(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-500/10 transition-colors flex items-center"
                                        >
                                            <FiTrash2 className="w-4 h-4 mr-2" />
                                            Delete Customer
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {showEditModal && (
                    <EditCustomerModal
                        customer={customer}
                        onClose={() => setShowEditModal(false)}
                        onSuccess={onRefresh}
                    />
                )}
                {showDeleteModal && (
                    <DeleteConfirmationModal
                        customer={customer}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDelete}
                    />
                )}
                {showInteractionModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-background-dark rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Interaction History</h2>
                                <button
                                    onClick={() => setShowInteractionModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>
                            <InteractionHistory customerId={customer._id} />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CustomerCard; 