import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import SetupLayout from './SetupLayout';
import Button from '../../common/Button';
import { useProfileSetup } from '../../../context/ProfileSetupContext';
import profileService from '../../../services/profileService';

const SetupAddress = () => {
    const { currentStep, totalSteps, nextStep } = useProfileSetup();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    // Load address from localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.user?.address) {
            setFormData({
                street: userData.user.address.street || '',
                city: userData.user.address.city || '',
                state: userData.user.address.state || '',
                zipCode: userData.user.address.zipCode || '',
                country: userData.user.address.country || ''
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await profileService.setupAddress(formData);
            nextStep();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SetupLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="Your Address"
            subtitle="Where can we find you?"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                    fullWidth
                    label="Street Address"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
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
                        '& .MuiFormHelperText-root': {
                            color: 'white',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'white',
                        },
                    }}
                    helperText="Please enter your street address"
                    placeholder="Street Address"
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        variant="outlined"
                        className="bg-background-light/30"
                        sx={{ /* Same styles as above */ }}
                        helperText="Please enter your city"
                        placeholder="City"
                    />

                    <TextField
                        fullWidth
                        label="State/Province"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        variant="outlined"
                        className="bg-background-light/30"
                        sx={{ /* Same styles as above */ }}
                        helperText="Please enter your state or province"
                        placeholder="State/Province"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <TextField
                        fullWidth
                        label="ZIP/Postal Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        variant="outlined"
                        className="bg-background-light/30"
                        sx={{ /* Same styles as above */ }}
                        helperText="Please enter your ZIP or postal code"
                        placeholder="ZIP/Postal Code"
                    />

                    <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        variant="outlined"
                        className="bg-background-light/30"
                        sx={{ /* Same styles as above */ }}
                        helperText="Please enter your country"
                        placeholder="Country"
                    />
                </div>

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

export default SetupAddress; 