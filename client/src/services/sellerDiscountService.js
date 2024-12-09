import axiosConfig from './axiosConfig';

// Fetch all discounts with optional filters
export const getDiscounts = async (filters = {}) => {
    const response = await axiosConfig.get('/sellerDiscounts', { params: filters });
    return response.data;
};

// Get a single discount by ID
export const getDiscountById = async (discountId) => {
    const response = await axiosConfig.get(`/sellerDiscounts/${discountId}`);
    return response.data;
};

// Create a new discount
export const createDiscount = async (discountData) => {
    const response = await axiosConfig.post('/sellerDiscounts', discountData);
    return response.data;
};

// Update a discount
export const updateDiscount = async (discountId, discountData) => {
    const response = await axiosConfig.put(`/sellerDiscounts/${discountId}`, discountData);
    return response.data;
};

// Delete a discount
export const deleteDiscount = async (discountId) => {
    const response = await axiosConfig.delete(`/sellerDiscounts/${discountId}`);
    return response.data;
};

// Update discount status
export const updateDiscountStatus = async (discountId, status) => {
    const response = await axiosConfig.patch(`/sellerDiscounts/${discountId}/status`, { status });
    return response.data;
};

// Get discount statistics
export const getDiscountStats = async () => {
    const response = await axiosConfig.get('/sellerDiscounts/stats');
    return response.data;
};

export default {
    getDiscounts,
    getDiscountById,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    updateDiscountStatus,
    getDiscountStats
}; 