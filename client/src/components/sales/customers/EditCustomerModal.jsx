import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import customerService from '../../../services/customerService';
import { toast } from 'react-toastify';

const EditCustomerModal = ({ customer, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: customer.name.first,
        lastName: customer.name.last,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        status: customer.status
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await customerService.updateCustomer(customer._id, {
                name: {
                    first: formData.firstName,
                    last: formData.lastName
                },
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                status: formData.status
            });

            toast.success('Customer updated successfully');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to update customer');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-text-primary">Edit Customer</h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-1 hover:bg-background-light rounded-lg transition-colors"
                    >
                        <FiX className="w-6 h-6 text-text-primary" />
                    </motion.button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                First Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/50" />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-background-light rounded-lg border border-gray-200 focus:outline-none focus:border-primary-light text-text-primary"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">
                                Last Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/50" />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-background-light rounded-lg border border-gray-200 focus:outline-none focus:border-primary-light text-text-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/50" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-2 bg-background-light rounded-lg border border-gray-200 focus:outline-none focus:border-primary-light text-text-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Phone
                        </label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/50" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-2 bg-background-light rounded-lg border border-gray-200 focus:outline-none focus:border-primary-light text-text-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Address
                        </label>
                        <div className="relative">
                            <FiMapPin className="absolute left-3 top-3 text-text-primary/50" />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 bg-background-light rounded-lg border border-gray-200 focus:outline-none focus:border-primary-light text-text-primary"
                                rows="3"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-background-light rounded-lg border border-gray-200 focus:outline-none focus:border-primary-light text-text-primary"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-text-primary hover:bg-background-light rounded-lg transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-primary-light text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditCustomerModal; 