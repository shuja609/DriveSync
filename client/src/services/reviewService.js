import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const reviewApi = axios.create({
    baseURL: `${API_URL}/reviews`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
reviewApi.interceptors.request.use((config) => {
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

class ReviewService {
    // Get reviews for a vehicle
    async getVehicleReviews(vehicleId, page = 1, sortBy = '-createdAt') {
        try {
            const response = await reviewApi.get(`/vehicle/${vehicleId}`, {
                params: { page, sortBy }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Create a review
    async createReview(vehicleId, reviewData) {
        try {
            const response = await reviewApi.post(`/vehicle/${vehicleId}`, reviewData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Update a review
    async updateReview(reviewId, reviewData) {
        try {
            const response = await reviewApi.put(`/${reviewId}`, reviewData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Delete a review
    async deleteReview(reviewId) {
        try {
            const response = await reviewApi.delete(`/${reviewId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get user's reviews
    async getUserReviews(page = 1) {
        try {
            const response = await reviewApi.get('/user', {
                params: { page }
            });
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

export default new ReviewService(); 