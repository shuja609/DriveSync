import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TextField } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import ProfileLayout from './ProfileLayout';
import Button from '../common/Button';
import profileService from '../../services/profileService';

const AccountSettings = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        firstName: user?.name?.first || '',
        lastName: user?.name?.last || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.bio || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear messages when user starts typing
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await profileService.updateProfile({
                name: {
                    first: formData.firstName,
                    last: formData.lastName
                },
                phoneNumber: formData.phoneNumber,
                bio: formData.bio
            });

            if (response.success) {
                setSuccess('Profile updated successfully');
                setUser(response.user);
            }
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileLayout title="Account Settings">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
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

                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            className="bg-background-light/30"
                            sx={{ /* Same styles as above */ }}
                        />
                    </div>

                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        className="bg-background-light/30"
                        sx={{ /* Same styles as above */ }}
                    />

                    <TextField
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        className="bg-background-light/30"
                        sx={{ /* Same styles as above */ }}
                        helperText="Tell us about yourself (max 500 characters)"
                    />

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-green-500 text-sm text-center">
                            {success}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="w-32"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </ProfileLayout>
    );
};

export default AccountSettings; 