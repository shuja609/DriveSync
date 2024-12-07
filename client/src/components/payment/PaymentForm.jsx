import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { FiCreditCard, FiDollarSign, FiLock } from 'react-icons/fi';
import paymentService from '../../services/paymentService';

const PaymentForm = ({ order, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await paymentService.processPayment(order._id, {
                paymentMethod,
                amount: order.amount
            });

            enqueueSnackbar('Payment processed successfully!', { variant: 'success' });
            onSuccess(response.data);
        } catch (error) {
            enqueueSnackbar(error.message || 'Failed to process payment', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = [
        {
            id: 'bank_transfer',
            label: 'Bank Transfer',
            icon: <FiCreditCard className="w-6 h-6" />
        },
        {
            id: 'cash',
            label: 'Cash Payment',
            icon: <FiDollarSign className="w-6 h-6" />
        },
        {
            id: 'financing',
            label: 'Financing',
            icon: <FiLock className="w-6 h-6" />
        }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Payment Details</h2>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary font-medium">Order Total:</span>
                    <span className="text-2xl font-bold text-primary-light">
                        ${order.amount?.toFixed(2)}
                    </span>
                </div>
                <div className="text-sm text-text-primary/70">
                    Order #{order.orderNumber}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-text-primary font-medium mb-2">
                        Select Payment Method
                    </label>
                    <div className="grid gap-4 md:grid-cols-3">
                        {paymentMethods.map((method) => (
                            <motion.label
                                key={method.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                                    paymentMethod === method.id
                                        ? 'border-primary-light bg-primary-light/5'
                                        : 'border-gray-200 hover:border-primary-light/50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={paymentMethod === method.id}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="sr-only"
                                />
                                <div className="flex items-center space-x-3">
                                    <div className={`text-primary-light ${
                                        paymentMethod === method.id ? 'opacity-100' : 'opacity-50'
                                    }`}>
                                        {method.icon}
                                    </div>
                                    <span className={`font-medium ${
                                        paymentMethod === method.id ? 'text-primary-light' : 'text-text-primary'
                                    }`}>
                                        {method.label}
                                    </span>
                                </div>
                            </motion.label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCancel}
                        className="px-6 py-2 text-text-primary hover:text-primary-light transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            'Pay Now'
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm; 