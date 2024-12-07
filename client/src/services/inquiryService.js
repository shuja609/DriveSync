import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const inquiryApi = axios.create({
    baseURL: `${API_URL}/inquiries`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
inquiryApi.interceptors.request.use((config) => {
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

class InquiryService {
    // Create a new inquiry
    async createInquiry(inquiryData) {
        try {
            const response = await inquiryApi.post('/', inquiryData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get user's inquiries
    async getUserInquiries() {
        try {
            const response = await inquiryApi.get('/user');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Add response to inquiry (admin only)
    async addResponse(inquiryId, message) {
        try {
            const response = await inquiryApi.post(`/${inquiryId}/response`, { message });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Update inquiry status (admin only)
    async updateStatus(inquiryId, status, priority) {
        try {
            const response = await inquiryApi.put(`/${inquiryId}/status`, { status, priority });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get all inquiries (admin only)
    async getAllInquiries(filters = {}) {
        try {
            const response = await inquiryApi.get('/', { params: filters });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Error handler
    handleError(error) {
        if (error.response) {
            // Server responded with error
            return {
                success: false,
                message: error.response.data.message || 'An error occurred',
                error: error.response.data
            };
        } else if (error.request) {
            // Request made but no response
            return {
                success: false,
                message: 'No response from server',
                error: error.request
            };
        } else {
            // Request setup error
            return {
                success: false,
                message: 'Error setting up request',
                error: error.message
            };
        }
    }
}

export default new InquiryService(); 