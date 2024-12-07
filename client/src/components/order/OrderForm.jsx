import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';

const OrderForm = ({ vehicle, onClose }) => {
    const { isAuthenticated, user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        paymentMethod: '',
        shippingDetails: {
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            }
        },
        financingDetails: {
            isFinanced: false,
            downPayment: 0,
            termLength: 36
        }
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                contactInfo: {
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phoneNumber || ''
                }
            }));
        }
    }, [isAuthenticated, user]);

    const validateForm = () => {
        const newErrors = {};

        // Payment method validation
        if (!formData.paymentMethod) {
            newErrors.paymentMethod = 'Payment method is required';
        }

        // Shipping details validation
        if (!formData.shippingDetails.address.street) {
            newErrors.street = 'Street address is required';
        }
        if (!formData.shippingDetails.address.city) {
            newErrors.city = 'City is required';
        }
        if (!formData.shippingDetails.address.state) {
            newErrors.state = 'State is required';
        }
        if (!formData.shippingDetails.address.zipCode) {
            newErrors.zipCode = 'ZIP code is required';
        }
        if (!formData.shippingDetails.address.country) {
            newErrors.country = 'Country is required';
        }

        // Financing validation
        if (formData.paymentMethod === 'financing') {
            if (!formData.financingDetails.downPayment) {
                newErrors.downPayment = 'Down payment is required';
            } else if (formData.financingDetails.downPayment < vehicle.pricing.basePrice * 0.1) {
                newErrors.downPayment = 'Minimum down payment is 10% of vehicle price';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please log in to place an order');
            return;
        }

        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                vehicleId: vehicle._id,
                paymentMethod: formData.paymentMethod,
                shippingDetails: formData.shippingDetails,
                financingDetails: formData.paymentMethod === 'financing' ? formData.financingDetails : undefined
            };

            const response = await orderService.createOrder(orderData);
            
            if (response.success) {
                toast.success('Order created successfully!');
                onClose();
            } else {
                toast.error(response.message || 'Error creating order');
            }
        } catch (error) {
            toast.error(error.message || 'Error creating order');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateMonthlyPayment = () => {
        if (formData.paymentMethod !== 'financing') return 0;
        
        const principal = vehicle.pricing.basePrice - formData.financingDetails.downPayment;
        const rate = 0.0499 / 12; // 4.99% APR
        const months = formData.financingDetails.termLength;
        
        return (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    };

    return (
        <div className="p-6 bg-background-light rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-text-primary mb-4">Purchase Vehicle</h3>
            <div className="mb-6">
                <h4 className="text-xl font-semibold text-text-primary">Vehicle Details</h4>
                <p className="text-text-secondary">{vehicle.title}</p>
                <p className="text-text-secondary">Price: ${vehicle.pricing.basePrice.toLocaleString()}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-text-primary mb-2">Payment Method</label>
                    <select
                        value={formData.paymentMethod}
                        onChange={(e) => {
                            setFormData(prev => ({
                                ...prev,
                                paymentMethod: e.target.value
                            }));
                            setErrors(prev => ({ ...prev, paymentMethod: '' }));
                        }}
                        className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                            errors.paymentMethod ? 'border-2 border-red-500' : ''
                        }`}
                        required
                    >
                        <option value="">Select payment method</option>
                        <option value="cash">Cash</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="financing">Financing</option>
                    </select>
                    {errors.paymentMethod && (
                        <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
                    )}
                </div>

                {formData.paymentMethod === 'financing' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-text-primary mb-2">Down Payment</label>
                            <input
                                type="number"
                                value={formData.financingDetails.downPayment}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        financingDetails: {
                                            ...prev.financingDetails,
                                            downPayment: parseFloat(e.target.value)
                                        }
                                    }));
                                    setErrors(prev => ({ ...prev, downPayment: '' }));
                                }}
                                min={vehicle.pricing.basePrice * 0.1}
                                max={vehicle.pricing.basePrice * 0.5}
                                step={1000}
                                className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                    errors.downPayment ? 'border-2 border-red-500' : ''
                                }`}
                            />
                            {errors.downPayment && (
                                <p className="text-red-500 text-sm mt-1">{errors.downPayment}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-text-primary mb-2">Term Length</label>
                            <select
                                value={formData.financingDetails.termLength}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        financingDetails: {
                                            ...prev.financingDetails,
                                            termLength: parseInt(e.target.value)
                                        }
                                    }));
                                }}
                                className="w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary"
                            >
                                <option value={36}>36 months</option>
                                <option value={48}>48 months</option>
                                <option value={60}>60 months</option>
                            </select>
                        </div>

                        <div className="p-4 bg-background-dark rounded-lg">
                            <h5 className="text-lg font-semibold text-text-primary mb-2">Financing Summary</h5>
                            <div className="space-y-2">
                                <p className="text-text-secondary">Vehicle Price: ${vehicle.pricing.basePrice.toLocaleString()}</p>
                                <p className="text-text-secondary">Down Payment: ${formData.financingDetails.downPayment.toLocaleString()}</p>
                                <p className="text-text-secondary">Term Length: {formData.financingDetails.termLength} months</p>
                                <p className="text-text-secondary">Interest Rate: 4.99% APR</p>
                                <p className="text-text-primary font-semibold">
                                    Estimated Monthly Payment: ${calculateMonthlyPayment().toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="text-xl font-semibold text-text-primary mb-4">Shipping Details</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-text-primary mb-2">Street Address</label>
                            <input
                                type="text"
                                value={formData.shippingDetails.address.street}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        shippingDetails: {
                                            ...prev.shippingDetails,
                                            address: {
                                                ...prev.shippingDetails.address,
                                                street: e.target.value
                                            }
                                        }
                                    }));
                                    setErrors(prev => ({ ...prev, street: '' }));
                                }}
                                className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                    errors.street ? 'border-2 border-red-500' : ''
                                }`}
                                required
                            />
                            {errors.street && (
                                <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-text-primary mb-2">City</label>
                                <input
                                    type="text"
                                    value={formData.shippingDetails.address.city}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            shippingDetails: {
                                                ...prev.shippingDetails,
                                                address: {
                                                    ...prev.shippingDetails.address,
                                                    city: e.target.value
                                                }
                                            }
                                        }));
                                        setErrors(prev => ({ ...prev, city: '' }));
                                    }}
                                    className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                        errors.city ? 'border-2 border-red-500' : ''
                                    }`}
                                    required
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-text-primary mb-2">State</label>
                                <input
                                    type="text"
                                    value={formData.shippingDetails.address.state}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            shippingDetails: {
                                                ...prev.shippingDetails,
                                                address: {
                                                    ...prev.shippingDetails.address,
                                                    state: e.target.value
                                                }
                                            }
                                        }));
                                        setErrors(prev => ({ ...prev, state: '' }));
                                    }}
                                    className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                        errors.state ? 'border-2 border-red-500' : ''
                                    }`}
                                    required
                                />
                                {errors.state && (
                                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-text-primary mb-2">ZIP Code</label>
                                <input
                                    type="text"
                                    value={formData.shippingDetails.address.zipCode}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            shippingDetails: {
                                                ...prev.shippingDetails,
                                                address: {
                                                    ...prev.shippingDetails.address,
                                                    zipCode: e.target.value
                                                }
                                            }
                                        }));
                                        setErrors(prev => ({ ...prev, zipCode: '' }));
                                    }}
                                    className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                        errors.zipCode ? 'border-2 border-red-500' : ''
                                    }`}
                                    required
                                />
                                {errors.zipCode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-text-primary mb-2">Country</label>
                                <input
                                    type="text"
                                    value={formData.shippingDetails.address.country}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            shippingDetails: {
                                                ...prev.shippingDetails,
                                                address: {
                                                    ...prev.shippingDetails.address,
                                                    country: e.target.value
                                                }
                                            }
                                        }));
                                        setErrors(prev => ({ ...prev, country: '' }));
                                    }}
                                    className={`w-full px-4 py-2 bg-background-dark rounded-lg text-text-primary ${
                                        errors.country ? 'border-2 border-red-500' : ''
                                    }`}
                                    required
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-background-dark text-text-primary rounded-lg hover:bg-opacity-80 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrderForm; 