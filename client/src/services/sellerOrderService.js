import axiosConfig from './axiosConfig';

// Fetch all orders with optional filters
export const getOrders = async (filters = {}) => {
    const response = await axiosConfig.get('/sellerOrders', { params: filters });
    return response.data;
};

// Get a single order by ID
export const getOrderById = async (orderId) => {
    const response = await axiosConfig.get(`/sellerOrders/${orderId}`);
    return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
    const response = await axiosConfig.patch(`/sellerOrders/${orderId}/status`, { status });
    return response.data;
};

// Update payment status
export const updatePaymentStatus = async (orderId, paymentStatus) => {
    const response = await axiosConfig.patch(`/sellerOrders/${orderId}/payment-status`, { status: paymentStatus });
    return response.data;
};

// Update delivery status
export const updateDeliveryStatus = async (orderId, deliveryStatus) => {
    const response = await axiosConfig.patch(`/sellerOrders/${orderId}/delivery-status`, { status: deliveryStatus });
    return response.data;
};

// Add a note to an order
export const addOrderNote = async (orderId, content) => {
    const response = await axiosConfig.post(`/sellerOrders/${orderId}/notes`, { content });
    return response.data;
};

// Upload order document
export const uploadOrderDocument = async (orderId, documentType, file) => {
    const formData = new FormData();
    formData.append('type', documentType);
    formData.append('document', file);

    const response = await axiosConfig.post(`/sellerOrders/${orderId}/documents`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Update financing details
export const updateFinancingDetails = async (orderId, financingData) => {
    const response = await axiosConfig.patch(`/sellerOrders/${orderId}/financing`, financingData);
    return response.data;
};

export default {
    getOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    updateDeliveryStatus,
    addOrderNote,
    uploadOrderDocument,
    updateFinancingDetails
}; 