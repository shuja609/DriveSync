import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const bookingApi = axios.create({
    baseURL: `${API_URL}/bookings`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
bookingApi.interceptors.request.use((config) => {
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

class BookingService {
    // Create a new booking
    async createBooking(bookingData) {
        try {
            const response = await bookingApi.post('/', bookingData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get user's bookings
    async getUserBookings() {
        try {
            const response = await bookingApi.get('/user');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Update booking status
    async updateBookingStatus(bookingId, status) {
        try {
            const response = await bookingApi.put(`/${bookingId}/status`, { status });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Cancel booking
    async cancelBooking(bookingId) {
        try {
            const response = await bookingApi.put(`/${bookingId}/cancel`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get all bookings (admin only)
    async getAllBookings(filters = {}) {
        try {
            const response = await bookingApi.get('/', { params: filters });
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

export default new BookingService(); 