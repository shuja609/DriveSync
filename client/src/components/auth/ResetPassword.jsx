import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TextField, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../common/AuthLayout';
import Button from '../common/Button';

const ResetPassword = () => {
    const { resetPassword, error } = useAuth();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setPasswordError('');
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
            setPasswordError('Invalid reset token');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, formData.password);
            // Navigation to login is handled in the AuthContext
        } catch (error) {
            console.error('Password reset failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Your Password"
            subtitle="Please enter your new password"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 space-y-6"
            >
                {(error || passwordError) && (
                    <Alert severity="error" className="mb-4">
                        {error || passwordError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <TextField
                        fullWidth
                        label="New Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        className="bg-background-light/30"
                        helperText="Password must be at least 8 characters long"
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
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        className="bg-background-light/30"
                        sx={{ /* Same styles as above */ }}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            </motion.div>
        </AuthLayout>
    );
};

export default ResetPassword; 