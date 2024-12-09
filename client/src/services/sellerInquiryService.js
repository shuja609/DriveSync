import axiosConfig from './axiosConfig';

// Fetch all inquiries with optional filters
export const getInquiries = async (filters = {}) => {
    const response = await axiosConfig.get('/sellerInquiries', { params: filters });
    return response.data;
};

// Get a single inquiry by ID
export const getInquiryById = async (inquiryId) => {
    const response = await axiosConfig.get(`/sellerInquiries/${inquiryId}`);
    return response.data;
};

// Update inquiry status
export const updateInquiryStatus = async (inquiryId, status) => {
    const response = await axiosConfig.patch(`/sellerInquiries/${inquiryId}/status`, { status });
    return response.data;
};

// Update inquiry priority
export const updateInquiryPriority = async (inquiryId, priority) => {
    const response = await axiosConfig.patch(`/sellerInquiries/${inquiryId}/priority`, { priority });
    return response.data;
};

// Add a response to an inquiry
export const respondToInquiry = async (inquiryId, message) => {
    const response = await axiosConfig.post(`/sellerInquiries/${inquiryId}/respond`, { message });
    return response.data;
};

export default {
    getInquiries,
    getInquiryById,
    updateInquiryStatus,
    updateInquiryPriority,
    respondToInquiry
}; 