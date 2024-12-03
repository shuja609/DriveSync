import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TextField, IconButton, Alert } from '@mui/material';
import { Add, Delete, Check, Error } from '@mui/icons-material';
import ProfileLayout from './ProfileLayout';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';

const EmailSettings = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const handleAddEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await profileService.addEmail(newEmail);
            if (response.success) {
                setSuccess('Verification email sent. Please check your inbox.');
                setNewEmail('');
                // Update user data with new email in pending state
                setUser(response.user);
            }
        } catch (err) {
            setError(err.message || 'Failed to add email');
        } finally {
            setLoading(false);
        }
    };

    const handleSetPrimary = async (email) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await profileService.setPrimaryEmail(email);
            if (response.success) {
                setSuccess('Primary email updated successfully');
                setUser(response.user);
            }
        } catch (err) {
            setError(err.message || 'Failed to set primary email');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveEmail = async (email) => {
        if (window.confirm('Are you sure you want to remove this email?')) {
            setLoading(true);
            setError('');
            setSuccess('');

            try {
                const response = await profileService.removeEmail(email);
                if (response.success) {
                    setSuccess('Email removed successfully');
                    setUser(response.user);
                }
            } catch (err) {
                setError(err.message || 'Failed to remove email');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <ProfileLayout title="Email Settings">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl space-y-6"
            >
                {/* Current Emails List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                        Your Email Addresses
                    </h3>
                    
                    {user.emails?.map((email, index) => (
                        <div 
                            key={index}
                            className="flex items-center justify-between p-4 bg-background-dark rounded-lg"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex flex-col">
                                    <span className="text-text-primary">
                                        {email.address}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        {email.isPrimary && (
                                            <span className="text-xs text-primary-light">
                                                Primary
                                            </span>
                                        )}
                                        {email.isVerified ? (
                                            <span className="flex items-center text-xs text-green-500">
                                                <Check className="w-3 h-3 mr-1" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-xs text-yellow-500">
                                                <Error className="w-3 h-3 mr-1" />
                                                Pending Verification
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {!email.isPrimary && email.isVerified && (
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => handleSetPrimary(email.address)}
                                        disabled={loading}
                                    >
                                        Set as Primary
                                    </Button>
                                )}
                                {!email.isPrimary && (
                                    <IconButton
                                        onClick={() => handleRemoveEmail(email.address)}
                                        disabled={loading}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Delete />
                                    </IconButton>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add New Email Form */}
                <form onSubmit={handleAddEmail} className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                        Add New Email
                    </h3>
                    
                    <div className="flex items-center space-x-4">
                        <TextField
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter new email address"
                            required
                            fullWidth
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
                                    color: 'white',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="whitespace-nowrap"
                        >
                            <Add className="w-5 h-5 mr-1" />
                            Add Email
                        </Button>
                    </div>
                </form>

                {/* Messages */}
                {error && (
                    <Alert severity="error" className="mt-4">
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" className="mt-4">
                        {success}
                    </Alert>
                )}

                {/* Info Section */}
                <div className="mt-8 p-4 bg-background-dark rounded-lg">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                        About Email Settings
                    </h4>
                    <ul className="list-disc list-inside text-sm text-text-primary/70 space-y-1">
                        <li>You can add up to 3 email addresses to your account</li>
                        <li>One email must be set as primary</li>
                        <li>New emails require verification</li>
                        <li>Primary email cannot be removed</li>
                    </ul>
                </div>
            </motion.div>
        </ProfileLayout>
    );
};

export default EmailSettings; 