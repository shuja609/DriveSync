import api from './axiosConfig';

// Mock payment processing
const processPayment = async (orderId, paymentDetails) => {
    try {
        const response = await api.post(`/payments/process/${orderId}`, paymentDetails);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error processing payment' };
    }
};

// Get payment status
const getPaymentStatus = async (orderId) => {
    try {
        const response = await api.get(`/payments/status/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error getting payment status' };
    }
};

const paymentService = {
    processPayment,
    getPaymentStatus
};

export default paymentService; 