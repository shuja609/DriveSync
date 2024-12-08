import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const geminiApi = axios.create({
    baseURL: `${API_URL}/gemini`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
geminiApi.interceptors.request.use((config) => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
        try {
            const { token } = JSON.parse(userData);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
    return config;
});

const geminiService = {
    // Send user query to Gemini API
    async getResponse(query) {
        try {
            const response = await geminiApi.post('/query', { query });
            return response.data;
        } catch (error) {
            console.error('Error in Gemini service:', error);
            throw error;
        }
    },

    // Get available features/capabilities
    async getCapabilities() {
        try {
            const response = await geminiApi.get('/capabilities');
            return response.data;
        } catch (error) {
            console.error('Error fetching capabilities:', error);
            throw error;
        }
    }
};

export default geminiService; 