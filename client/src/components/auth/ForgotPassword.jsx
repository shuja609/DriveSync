import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TextField, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../common/AuthLayout';
import Button from '../common/Button';

const ForgotPassword = () => {
    const { forgotPassword, error } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (error) {
            console.error('Password reset request failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to receive a password reset link"
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

                {success ? (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="space-y-4"
                    >
                        <Alert severity="success">
                            Password reset instructions have been sent to your email.
                        </Alert>
                        <p className="text-text-primary/70 text-center">
                            Please check your email and follow the instructions to reset your password.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            }}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                )}

                <div className="text-center">
                    <Link
                        to="/login"
                        className="text-primary-light hover:text-primary-dark text-sm"
                    >
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </AuthLayout>
    );
};

export default ForgotPassword; 