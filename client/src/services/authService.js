import axios from 'axios';
import deviceService from './deviceService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
    async login(email, password, rememberMe = false, rememberDevice = false) {
        try {
            const deviceInfo = deviceService.getDeviceInfo();
            
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
                deviceInfo
            });

            if (response.data.success && response.data.token) {
                const userData = {
                    token: response.data.token,
                    user: response.data.user,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString(),
                    deviceInfo
                };

                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('user', JSON.stringify(userData));
                }

                if (rememberDevice) {
                    deviceService.saveDeviceToStorage(deviceInfo, true);
                }
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name: {
                    first: userData.name.first,
                    last: userData.name.last
                },
                email: userData.email,
                password: userData.password
            });
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async googleLogin(tokenId) {
        const response = await axios.post(`${API_URL}/auth/login/google`, {
            idToken: tokenId
        });

        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    }

    async forgotPassword(email) {
        const response = await axios.post(`${API_URL}/auth/forgot-password`, {
            email
        });
        return response.data;
    }

    async resetPassword(token, password) {
        const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, {
            password
        });
        return response.data;
    }

    async verifyEmail(token) {
       // console.log('Attempting to verify email with token:', token);
        try {
            const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
         //   console.log('Verification response:', response.data);
            
            if (response.data.success && response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            
            return response.data;
        } catch (error) {
            console.error('Verification error:', error.response?.data || error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
    }

    getCurrentUser() {
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userData) return null;

        try {
            const parsedData = JSON.parse(userData);
            // Check if token exists and user is logged in
            if (parsedData.token && parsedData.isLoggedIn) {
                return parsedData.user;
            }
            return null;
        } catch {
            return null;
        }
    }

    isDeviceRemembered() {
        return deviceService.getRememberedDevice() !== null;
    }

    forgetDevice() {
        deviceService.forgetDevice();
    }
}

const authServiceInstance = new AuthService();
export default authServiceInstance; 