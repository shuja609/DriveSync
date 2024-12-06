import api from './axiosConfig';

const transactionService = {
    // Get all transactions (admin only)
    getAllTransactions: async () => {
        const response = await api.get('/transactions');
        return response.data;
    },

    // Get user's transactions
    getMyTransactions: async () => {
        const response = await api.get('/transactions/my-transactions');
        return response.data;
    },

    // Get single transaction
    getTransaction: async (transactionId) => {
        const response = await api.get(`/transactions/${transactionId}`);
        return response.data;
    },

    // Process payment
    processPayment: async (paymentData) => {
        const response = await api.post('/transactions/process-payment', paymentData);
        return response.data;
    },

    // Process refund (admin only)
    processRefund: async (refundData) => {
        const response = await api.post('/transactions/process-refund', refundData);
        return response.data;
    }
};

export default transactionService; 