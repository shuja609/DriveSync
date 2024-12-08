import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import deviceService from '../services/deviceService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check authentication status on app load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                console.log('Current user data:', currentUser);
                const rememberedDevice = deviceService.getRememberedDevice();
                
                if (currentUser && currentUser.id && currentUser.email) {
                    // Verify if the current device matches the remembered device
                    const currentDevice = deviceService.getDeviceInfo();
                    const isDeviceVerified = rememberedDevice && 
                        rememberedDevice.deviceId === currentDevice.deviceId;

                    if (isDeviceVerified || !rememberedDevice) {
                        setUser(currentUser);
                        
                        // Add debug logs
                        console.log('User authenticated:', {
                            id: currentUser.id,
                            email: currentUser.email
                        });
                        console.log('Current path:', window.location.pathname);
                        
                        // Only redirect to setup if explicitly needed
                        if (window.location.pathname === '/setup/step1' && 
                            !window.location.pathname.startsWith('/setup')) {
                            navigate('/setup/step1');
                        }
                    } else {
                        // Device not recognized, clear stored data
                        authService.logout();
                        deviceService.forgetDevice();
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                authService.logout();
                setError('Authentication check failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const login = async (email, password, rememberMe = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.login(email, password, rememberMe);
            if (data.success && data.user) {
                setUser(data.user);
                
                // Redirect based on profile completion
                if(data.user.role === 'admin') {
                    navigate('/admin');
                } else if (data.user.role === 'sales') {
                    navigate('/sales');
                } else {
                    navigate('/');
                }
            } else {
                setError('Invalid email or password. Please try again.');
            }
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.register(userData);
            setUser(data.user);
            navigate('/verify-email');
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred during registration';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async (tokenId) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.googleLogin(tokenId);
            setUser(data.user);
            if(data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during Google login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        navigate('/');
    };

    const forgotPassword = async (email) => {
        try {
            setLoading(true);
            setError(null);
            return await authService.forgotPassword(email);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token, password) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.resetPassword(token, password);
            navigate('/login');
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const setUserData = (userData) => {
        setUser(userData);
        // Update localStorage/sessionStorage
        const currentStorage = localStorage.getItem('user') ? localStorage : sessionStorage;
        const currentData = JSON.parse(currentStorage.getItem('user') || '{}');
        currentStorage.setItem('user', JSON.stringify({
            ...currentData,
            user: userData
        }));
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            setError,
            setUser: setUserData,
            login,
            register,
            googleLogin,
            logout,
            forgotPassword,
            resetPassword,
            isAuthenticated: !!user
        }}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 