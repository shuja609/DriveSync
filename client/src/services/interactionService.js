import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getCustomerInteractions = async (customerId) => {
    try {
        console.log('Fetching interactions for customer:', customerId); // Debug log
        const response = await axios.get(`${API_URL}/interactions/${customerId}`, {
            headers: getAuthHeader()
        });
        console.log('Interactions response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Error fetching interactions:', error); // Debug log
        if (error.response) {
            throw error.response.data;
        }
        throw { success: false, message: error.message };
    }
};

const interactionService = {
    getCustomerInteractions
};

export default interactionService; 