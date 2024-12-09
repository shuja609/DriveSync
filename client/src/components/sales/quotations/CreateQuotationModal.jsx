import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';
import quotationService from '../../../services/quotationService';
import vehicleService from '../../../services/vehicleService';
import axiosConfig from '../../../services/axiosConfig';

const CreateQuotationModal = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        customerId: '',
        vehicleId: '',
        basePrice: '',
        additionalFeatures: [],
        discounts: [],
        financingOptions: [{
            downPayment: '',
            monthlyInstallment: '',
            term: '',
            interestRate: ''
        }],
        notes: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                // Get users with role 'user'
                const [usersResponse, vehiclesResponse] = await Promise.all([
                    axiosConfig.get('/users?role=user'),
                    vehicleService.getVehicles()
                ]);

                if (usersResponse.data) {
                    setCustomers(usersResponse.data.data || []);
                }
                if (vehiclesResponse.success) {
                    setVehicles(vehiclesResponse.data || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load required data');
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If vehicle is selected, set base price
        if (name === 'vehicleId') {
            const selectedVehicle = vehicles.find(v => v._id === value);
            if (selectedVehicle) {
                setFormData(prev => ({
                    ...prev,
                    basePrice: selectedVehicle.price.toString()
                }));
            }
        }
    };

    const handleAddFeature = () => {
        setFormData(prev => ({
            ...prev,
            additionalFeatures: [...prev.additionalFeatures, { name: '', price: '' }]
        }));
    };

    const handleRemoveFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            additionalFeatures: prev.additionalFeatures.filter((_, i) => i !== index)
        }));
    };

    const handleFeatureChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            additionalFeatures: prev.additionalFeatures.map((feature, i) => 
                i === index ? { ...feature, [field]: value } : feature
            )
        }));
    };

    const handleAddDiscount = () => {
        setFormData(prev => ({
            ...prev,
            discounts: [...prev.discounts, { description: '', amount: '' }]
        }));
    };

    const handleRemoveDiscount = (index) => {
        setFormData(prev => ({
            ...prev,
            discounts: prev.discounts.filter((_, i) => i !== index)
        }));
    };

    const handleDiscountChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            discounts: prev.discounts.map((discount, i) => 
                i === index ? { ...discount, [field]: value } : discount
            )
        }));
    };

    const handleFinancingChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            financingOptions: prev.financingOptions.map((option, i) => 
                i === index ? { ...option, [field]: value } : option
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await quotationService.createQuotation(formData);
            if (response.success) {
                onSuccess();
            }
        } catch (error) {
            setError(error.message || 'Error creating quotation');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create New Quotation</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Customer Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Customer
                            </label>
                            <select
                                name="customerId"
                                value={formData.customerId}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                            >
                                <option value="">Select Customer</option>
                                {Array.isArray(customers) && customers.map(customer => (
                                    <option key={customer._id} value={customer._id}>
                                        {customer.name.first} {customer.name.last}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Vehicle Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vehicle
                            </label>
                            <select
                                name="vehicleId"
                                value={formData.vehicleId}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                            >
                                <option value="">Select Vehicle</option>
                                {Array.isArray(vehicles) && vehicles.map(vehicle => (
                                    <option key={vehicle._id} value={vehicle._id}>
                                        {vehicle.year} {vehicle.make} {vehicle.model} - ${vehicle.price.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Base Price */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Base Price
                            </label>
                            <input
                                type="number"
                                name="basePrice"
                                value={formData.basePrice}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* Additional Features */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Additional Features
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="text-primary-light hover:text-primary-dark"
                                >
                                    <FiPlus size={20} />
                                </button>
                            </div>
                            {formData.additionalFeatures.map((feature, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={feature.name}
                                        onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                                        placeholder="Feature name"
                                        className="flex-1 border border-gray-300 rounded-lg p-2"
                                    />
                                    <input
                                        type="number"
                                        value={feature.price}
                                        onChange={(e) => handleFeatureChange(index, 'price', e.target.value)}
                                        placeholder="Price"
                                        className="w-32 border border-gray-300 rounded-lg p-2"
                                        min="0"
                                        step="0.01"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FiMinus size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Discounts */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Discounts
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddDiscount}
                                    className="text-primary-light hover:text-primary-dark"
                                >
                                    <FiPlus size={20} />
                                </button>
                            </div>
                            {formData.discounts.map((discount, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={discount.description}
                                        onChange={(e) => handleDiscountChange(index, 'description', e.target.value)}
                                        placeholder="Discount description"
                                        className="flex-1 border border-gray-300 rounded-lg p-2"
                                    />
                                    <input
                                        type="number"
                                        value={discount.amount}
                                        onChange={(e) => handleDiscountChange(index, 'amount', e.target.value)}
                                        placeholder="Amount"
                                        className="w-32 border border-gray-300 rounded-lg p-2"
                                        min="0"
                                        step="0.01"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDiscount(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FiMinus size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Financing Options */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Financing Options
                            </label>
                            {formData.financingOptions.map((option, index) => (
                                <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                                    <input
                                        type="number"
                                        value={option.downPayment}
                                        onChange={(e) => handleFinancingChange(index, 'downPayment', e.target.value)}
                                        placeholder="Down Payment"
                                        className="border border-gray-300 rounded-lg p-2"
                                        min="0"
                                        step="0.01"
                                    />
                                    <input
                                        type="number"
                                        value={option.monthlyInstallment}
                                        onChange={(e) => handleFinancingChange(index, 'monthlyInstallment', e.target.value)}
                                        placeholder="Monthly Payment"
                                        className="border border-gray-300 rounded-lg p-2"
                                        min="0"
                                        step="0.01"
                                    />
                                    <input
                                        type="number"
                                        value={option.term}
                                        onChange={(e) => handleFinancingChange(index, 'term', e.target.value)}
                                        placeholder="Term (months)"
                                        className="border border-gray-300 rounded-lg p-2"
                                        min="1"
                                    />
                                    <input
                                        type="number"
                                        value={option.interestRate}
                                        onChange={(e) => handleFinancingChange(index, 'interestRate', e.target.value)}
                                        placeholder="Interest Rate (%)"
                                        className="border border-gray-300 rounded-lg p-2"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Notes */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                rows="3"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Creating...' : 'Create Quotation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateQuotationModal; 