import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiTag, FiPercent } from 'react-icons/fi';
import sellerDiscountService from '../../../services/sellerDiscountService';

const initialFormState = {
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    startDate: '',
    endDate: '',
    maxDiscountAmount: '',
    minPurchaseAmount: '',
    usageLimit: '',
    conditions: {
        vehicleTypes: [],
        brands: [],
        minYear: '',
        maxYear: ''
    }
};

const SellerDiscountManagement = () => {
    const [discounts, setDiscounts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all'
    });

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchDiscounts();
        fetchStats();
    }, [filters]);

    useEffect(() => {
        if (selectedDiscount) {
            setFormData({
                ...selectedDiscount,
                startDate: new Date(selectedDiscount.startDate).toISOString().slice(0, 16),
                endDate: new Date(selectedDiscount.endDate).toISOString().slice(0, 16),
                conditions: {
                    vehicleTypes: selectedDiscount.conditions?.vehicleTypes || [],
                    brands: selectedDiscount.conditions?.brands || [],
                    minYear: selectedDiscount.conditions?.minYear || '',
                    maxYear: selectedDiscount.conditions?.maxYear || ''
                }
            });
        } else {
            resetForm();
        }
    }, [selectedDiscount]);

    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const queryFilters = {};
            if (filters.status !== 'all') queryFilters.status = filters.status;
            if (filters.type !== 'all') queryFilters.type = filters.type;
            
            const response = await sellerDiscountService.getDiscounts(queryFilters);
            setDiscounts(response.discounts);
        } catch (error) {
            console.error('Error fetching discounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await sellerDiscountService.getDiscountStats();
            setStats(response);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const payload = {
                ...formData,
                value: parseFloat(formData.value),
                maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
                minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : undefined,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
                conditions: {
                    ...formData.conditions,
                    minYear: formData.conditions.minYear ? parseInt(formData.conditions.minYear) : undefined,
                    maxYear: formData.conditions.maxYear ? parseInt(formData.conditions.maxYear) : undefined
                }
            };

            if (selectedDiscount) {
                await sellerDiscountService.updateDiscount(selectedDiscount._id, payload);
            } else {
                await sellerDiscountService.createDiscount(payload);
            }

            fetchDiscounts();
            setIsModalOpen(false);
            setSelectedDiscount(null);
            resetForm();
        } catch (error) {
            console.error('Error saving discount:', error);
            // Handle error appropriately
        }
    };

    const handleDelete = async (discountId) => {
        if (window.confirm('Are you sure you want to delete this discount?')) {
            try {
                await sellerDiscountService.deleteDiscount(discountId);
                fetchDiscounts();
                fetchStats();
            } catch (error) {
                console.error('Error deleting discount:', error);
            }
        }
    };

    const handleStatusChange = async (discountId, newStatus) => {
        try {
            await sellerDiscountService.updateDiscountStatus(discountId, newStatus);
            fetchDiscounts();
            fetchStats();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'inactive': return 'bg-yellow-500';
            case 'expired': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-light">Discount Management</h1>
                    {stats && (
                        <div className="flex gap-4 mt-2">
                            <div className="text-sm">
                                <span className="text-green-500 font-semibold">{stats.summary.active}</span> Active
                            </div>
                            <div className="text-sm">
                                <span className="text-yellow-500 font-semibold">{stats.summary.inactive}</span> Inactive
                            </div>
                            <div className="text-sm">
                                <span className="text-red-500 font-semibold">{stats.summary.expired}</span> Expired
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-4">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="p-2 border rounded-lg text-black/80 focus:outline-none focus:ring-2 focus:ring-primary-light"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                    </select>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="p-2 border rounded-lg text-black/80 focus:outline-none focus:ring-2 focus:ring-primary-light"
                    >
                        <option value="all">All Types</option>
                        <option value="percentage">Percentage</option>
                        <option value="fixed_amount">Fixed Amount</option>
                    </select>
                    <button
                        onClick={() => {
                            setSelectedDiscount(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                        <FiPlus /> New Discount
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading discounts...</div>
            ) : discounts.length === 0 ? (
                <div className="text-center py-4">No discounts found</div>
            ) : (
                <div className="grid gap-4">
                    {discounts.map((discount) => (
                        <motion.div
                            key={discount._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-4 rounded-lg shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg text-primary-light">{discount.code}</h3>
                                        <select
                                            value={discount.status}
                                            onChange={(e) => handleStatusChange(discount._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(discount.status)} cursor-pointer border-none focus:ring-2 focus:ring-offset-2`}
                                        >
                                            <option value="active" className="bg-gray-800 text-white">ACTIVE</option>
                                            <option value="inactive" className="bg-gray-800 text-white">INACTIVE</option>
                                            <option value="expired" className="bg-gray-800 text-white">EXPIRED</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-gray-600 flex items-center gap-2">
                                                <FiPercent className="text-primary-light"/>
                                                {discount.type === 'percentage' ? `${discount.value}% off` : `$${discount.value} off`}
                                            </p>
                                            <p className="text-gray-600 flex items-center gap-2">
                                                <FiCalendar className="text-primary-light"/>
                                                {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-600 flex items-center gap-2">
                                                <FiTag className="text-primary-light"/>
                                                Used {discount.usedCount} times
                                                {discount.usageLimit && ` (Limit: ${discount.usageLimit})`}
                                            </p>
                                        </div>
                                        <div>
                                            {discount.minPurchaseAmount > 0 && (
                                                <p className="text-gray-600">
                                                    Min. Purchase: ${discount.minPurchaseAmount}
                                                </p>
                                            )}
                                            {discount.maxDiscountAmount && (
                                                <p className="text-gray-600">
                                                    Max. Discount: ${discount.maxDiscountAmount}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{discount.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedDiscount(discount);
                                            setFormData({
                                                ...discount,
                                                startDate: new Date(discount.startDate).toISOString().split('T')[0],
                                                endDate: new Date(discount.endDate).toISOString().split('T')[0]
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                    >
                                        <FiEdit2 className="text-primary-light"/>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(discount._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal for creating/editing discounts */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-700 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-white">
                            {selectedDiscount ? 'Edit Discount' : 'Create New Discount'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Basic Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Code*</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            code: e.target.value.toUpperCase().replace(/\s+/g, '') 
                                        }))}
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        required
                                        pattern="^[A-Z0-9_-]{3,15}$"
                                        title="Code must be 3-15 characters long and can only contain uppercase letters, numbers, underscores, and hyphens"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Type*</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        required
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed_amount">Fixed Amount</option>
                                    </select>
                                </div>
                            </div>

                            {/* Value and Limits */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Value* ({formData.type === 'percentage' ? '%' : '$'})
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            value: Math.min(
                                                formData.type === 'percentage' ? 100 : 1000000,
                                                Math.max(0, parseFloat(e.target.value))
                                            )
                                        }))}
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        required
                                        min="0"
                                        max={formData.type === 'percentage' ? "100" : "1000000"}
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Max Discount Amount ($)</label>
                                    <input
                                        type="number"
                                        value={formData.maxDiscountAmount}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            maxDiscountAmount: e.target.value ? Math.max(0, parseFloat(e.target.value)) : '' 
                                        }))}
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Description*</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                    rows="2"
                                    required
                                    maxLength="200"
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Start Date*</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        required
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">End Date*</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        required
                                        min={formData.startDate}
                                    />
                                </div>
                            </div>

                            {/* Usage Limits */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Min Purchase Amount ($)</label>
                                    <input
                                        type="number"
                                        value={formData.minPurchaseAmount}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            minPurchaseAmount: Math.max(0, parseFloat(e.target.value)) 
                                        }))}
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Usage Limit</label>
                                    <input
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            usageLimit: e.target.value ? Math.max(1, parseInt(e.target.value)) : '' 
                                        }))}
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* Vehicle Conditions */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-300">Vehicle Conditions</h3>
                                
                                {/* Vehicle Types */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Vehicle Types</label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {['sedan', 'suv', 'truck', 'van', 'sports', 'luxury'].map(type => (
                                            <label key={type} className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.conditions.vehicleTypes.includes(type)}
                                                    onChange={(e) => {
                                                        const updatedTypes = e.target.checked
                                                            ? [...formData.conditions.vehicleTypes, type]
                                                            : formData.conditions.vehicleTypes.filter(t => t !== type);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            conditions: {
                                                                ...prev.conditions,
                                                                vehicleTypes: updatedTypes
                                                            }
                                                        }));
                                                    }}
                                                    className="rounded border-gray-400 text-blue-500 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-300 capitalize">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Brands */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Applicable Brands</label>
                                    <input
                                        type="text"
                                        value={formData.conditions.brands.join(', ')}
                                        onChange={(e) => {
                                            const brands = e.target.value
                                                .split(',')
                                                .map(brand => brand.trim())
                                                .filter(brand => brand);
                                            setFormData(prev => ({
                                                ...prev,
                                                conditions: {
                                                    ...prev.conditions,
                                                    brands
                                                }
                                            }));
                                        }}
                                        placeholder="Enter brands separated by commas"
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                    />
                                </div>

                                {/* Year Range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Min Year</label>
                                        <input
                                            type="number"
                                            value={formData.conditions.minYear}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                conditions: {
                                                    ...prev.conditions,
                                                    minYear: parseInt(e.target.value) || ''
                                                }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                            min="1900"
                                            max={new Date().getFullYear() + 1}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Max Year</label>
                                        <input
                                            type="number"
                                            value={formData.conditions.maxYear}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                conditions: {
                                                    ...prev.conditions,
                                                    maxYear: parseInt(e.target.value) || ''
                                                }
                                            }))}
                                            className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                            min={formData.conditions.minYear || "1900"}
                                            max={new Date().getFullYear() + 1}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSelectedDiscount(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    {selectedDiscount ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDiscountManagement; 