import axiosConfig from './axiosConfig';

// Get all feedback with filters
export const getFeedback = async (filters = {}) => {
    const response = await axiosConfig.get('/sellerFeedback', { params: filters });
    return response.data;
};

// Get feedback by ID
export const getFeedbackById = async (feedbackId) => {
    const response = await axiosConfig.get(`/sellerFeedback/${feedbackId}`);
    return response.data;
};

// Update feedback status
export const updateFeedbackStatus = async (feedbackId, status) => {
    const response = await axiosConfig.patch(`/sellerFeedback/${feedbackId}/status`, { status });
    return response.data;
};

// Update feedback priority
export const updateFeedbackPriority = async (feedbackId, priority) => {
    const response = await axiosConfig.patch(`/sellerFeedback/${feedbackId}/priority`, { priority });
    return response.data;
};

// Respond to feedback
export const respondToFeedback = async (feedbackId, responseText) => {
    const response = await axiosConfig.patch(`/sellerFeedback/${feedbackId}/respond`, { response: responseText });
    return response.data;
};

// Get feedback statistics
export const getFeedbackStats = async () => {
    const response = await axiosConfig.get('/sellerFeedback/stats');
    return response.data;
};

export default {
    getFeedback,
    getFeedbackById,
    updateFeedbackStatus,
    updateFeedbackPriority,
    respondToFeedback,
    getFeedbackStats
}; 