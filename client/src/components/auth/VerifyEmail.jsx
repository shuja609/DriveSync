import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Alert } from '@mui/material';
import { Email, CheckCircle } from '@mui/icons-material';
import AuthLayout from '../common/AuthLayout';
import Button from '../common/Button';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
    const { setUser } = useAuth();
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const [message, setMessage] = useState('');
    const verificationAttemptedRef = useRef(false);
    const location = useLocation();
    const navigate = useNavigate();

    const verifyEmail = useCallback(async (token) => {
        if (verificationAttemptedRef.current) {
            console.log('Verification already attempted, skipping...');
            return;
        }
        
        try {
            verificationAttemptedRef.current = true;
            const cleanToken = token.trim();
            const response = await authService.verifyEmail(cleanToken);
            
            if (response.success) {
                setVerificationStatus('success');
                setMessage(response.message || 'Email verified successfully!');
                
                if (response.user) {
                    setUser(response.user);
                }
                
                setTimeout(() => {
                    navigate('/setup/step1');
                }, 3000);
            } else {
                setVerificationStatus('error');
                setMessage(response.message || 'Verification failed');
            }
        } catch (error) {
            setVerificationStatus('error');
            setMessage(
                error.response?.data?.message || 
                error.message || 
                'Verification failed. Please try again.'
            );
        }
    }, [navigate, setUser]);

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        if (token && !verificationAttemptedRef.current) {
            verifyEmail(token);
        }
        
        return () => {
            verificationAttemptedRef.current = false;
        };
    }, [location, verifyEmail]);

    // If no token in URL, show the "check your email" message
    const showPendingMessage = !new URLSearchParams(location.search).get('token');

    return (
        <AuthLayout
            title="Verify Your Email"
            subtitle={showPendingMessage ? "Please check your email for verification link" : "Verifying your email..."}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-6 text-center"
            >
                {showPendingMessage && verificationStatus === 'pending' && (
                    <>
                        <div className="flex justify-center">
                            <Email className="text-primary-light w-24 h-24" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-text-primary">
                                We've sent a verification link to your email address.
                                Please click the link to verify your account.
                            </p>
                            <p className="text-text-primary/70 text-sm">
                                If you don't see the email, please check your spam folder.
                            </p>
                        </div>
                    </>
                )}

                {!showPendingMessage && verificationStatus === 'pending' && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-light"></div>
                    </div>
                )}

                {verificationStatus === 'success' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="space-y-4"
                    >
                        <CheckCircle className="text-green-500 w-24 h-24 mx-auto" />
                        <Alert severity="success">{message}</Alert>
                        <p className="text-text-primary">
                            Redirecting you to setup...
                        </p>
                    </motion.div>
                )}

                {verificationStatus === 'error' && (
                    <Alert severity="error">{message}</Alert>
                )}

                <div className="pt-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </Button>
                </div>
            </motion.div>
        </AuthLayout>
    );
};

export default VerifyEmail; 