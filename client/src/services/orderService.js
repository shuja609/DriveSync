import api from './axiosConfig';

// Create a new order
const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error creating order' };
    }
};

// Get user's orders
const getUserOrders = async () => {
    try {
        const response = await api.get('/orders/my-orders');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching orders' };
    }
};

// Get order by ID
const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error fetching order' };
    }
};

// Update shipping details
const updateShippingDetails = async (orderId, shippingDetails) => {
    try {
        const response = await api.patch(`/orders/${orderId}/shipping`, { shippingDetails });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error updating shipping details' };
    }
};

// Add note to order
const addOrderNote = async (orderId, content) => {
    try {
        const response = await api.post(`/orders/${orderId}/notes`, { content });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error adding note' };
    }
};

const orderService = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateShippingDetails,
    addOrderNote
};

export default orderService; 