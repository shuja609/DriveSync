import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TextField, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../common/AuthLayout';
import GoogleAuthButton from './GoogleAuthButton';
import Button from '../common/Button';
import deviceService from '../../services/deviceService';

const Login = () => {
    const { login, error } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
        rememberDevice: false
    });
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null); // Added to handle form-level error messages

    useEffect(() => {
        const rememberedDevice = deviceService.getRememberedDevice();
        if (rememberedDevice) {
            setFormData(prev => ({
                ...prev,
                rememberDevice: true
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rememberMe' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(
                formData.email,
                formData.password,
                formData.rememberMe,
                formData.rememberDevice
            );
        } catch (error) {
            console.error('Login failed:', error);
            setFormError('Login failed. Please check your credentials and try again.'); // Set form-level error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Welcome Back"
            subtitle="Sign in to your account"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 space-y-6"
            >
                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}
                {formError && (
                    <Alert severity="error" className="mb-4">
                        {formError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        className="bg-background-light/30"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(224, 224, 224, 0.2)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(224, 224, 224, 0.4)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(224, 224, 224, 0.7)',
                            },
                            '& .MuiInputBase-input': {
                                color: 'rgb(224, 224, 224)',
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        className="bg-background-light/30"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(224, 224, 224, 0.2)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(224, 224, 224, 0.4)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(224, 224, 224, 0.7)',
                            },
                            '& .MuiInputBase-input': {
                                color: 'rgb(224, 224, 224)',
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                            },
                        }}
                    />

                    <div className="flex items-center justify-between">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    sx={{
                                        color: 'rgb(224, 224, 224, 0.7)',
                                        '&.Mui-checked': {
                                            color: 'rgb(57, 73, 171)',
                                        },
                                    }}
                                />
                            }
                            label="Remember me"
                            className="text-text-primary/70 text-xs"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="rememberDevice"
                                    checked={formData.rememberDevice}
                                    onChange={handleChange}
                                    sx={{
                                        color: 'rgb(224, 224, 224, 0.7)',
                                        '&.Mui-checked': {
                                            color: 'rgb(57, 73, 171)',
                                        },
                                    }}
                                />
                            }
                            label="Remember device"
                            className="text-text-primary/70 text-xxs"
                        />

                        <Link
                            to="/forgot-password"
                            className="text-primary-light hover:text-primary-dark text-xs"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-text-primary/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-background-dark text-text-primary/70">
                            Or continue with
                        </span>
                    </div>
                </div>

                <GoogleAuthButton />

                <p className="text-center text-sm text-text-primary/70">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-medium text-primary-light hover:text-primary-dark"
                    >
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </AuthLayout>
    );
};

export default Login;