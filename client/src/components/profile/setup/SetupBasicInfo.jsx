import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import SetupLayout from './SetupLayout';
import Button from '../../common/Button';
import { useProfileSetup } from '../../../context/ProfileSetupContext';
import profileService from '../../../services/profileService';

const SetupBasicInfo = () => {
    const { currentStep, totalSteps, nextStep } = useProfileSetup();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });
    const [fieldErrors, setFieldErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    // Load data from localStorage on component mount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.user) {
            const { name, phoneNumber } = userData.user;
            setFormData({
                firstName: name?.split(' ')[0] || '',
                lastName: name?.split(' ')[1] || '',
                phoneNumber: phoneNumber || ''
            });
        }
    }, []);

    const validatePhoneNumber = (phone) => {
        // Basic phone number validation: +XX-XXX-XXXXXXX or XXXXXXXXXXX
        const phoneRegex = /^(\+\d{1,3}[-.]?)?\d{10,14}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters long`;
                }
                if (!/^[a-zA-Z\s]*$/.test(value)) {
                    return 'Only letters and spaces are allowed';
                }
                break;
            case 'phoneNumber':
                if (!validatePhoneNumber(value)) {
                    return 'Please enter a valid phone number (e.g., +92-333-1234567 or 03331234567)';
                }
                break;
            default:
                return '';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        setFieldErrors(prev => ({
            ...prev,
            [name]: ''
        }));
        setError('');
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validateForm = () => {
        const errors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) errors[key] = error;
        });

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            // Format phone number before sending
            const formattedData = {
                ...formData,
                phoneNumber: formData.phoneNumber.replace(/\s+/g, '') // Remove spaces
            };
            await profileService.setupBasicInfo(formattedData);
            nextStep();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save basic information');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SetupLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="Let's Get Started"
            subtitle="Tell us a bit about yourself"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!fieldErrors.firstName}
                        helperText={fieldErrors.firstName}
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
                                color: 'white', // Placeholder text color set to white
                            },
                            '& .MuiInputBase-input': {
                                color: 'white', // Written text color set to white
                            },
                            '& .MuiFormHelperText-root': {
                                color: 'white', // Helper text color set to white
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: 'white', // Placeholder text color set to white
                            },
                        }}
                    />

                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!fieldErrors.lastName}
                        helperText={fieldErrors.lastName}
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
                    onBlur={handleBlur}
                    error={!!fieldErrors.phoneNumber}
                    helperText={fieldErrors.phoneNumber || "Format: +92-333-1234567 or 03331234567"}
                    required
                    fullWidth
                    variant="outlined"
                    className="bg-background-light/30"
                    sx={{ /* Same styles as above */ }}
                />

                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="flex justify-between pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => nextStep()}
                        className="w-24"
                    >
                        Skip
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-24"
                    >
                        {loading ? 'Saving...' : 'Next'}
                    </Button>
                </div>
            </form>
        </SetupLayout>
    );
};

export default SetupBasicInfo; 