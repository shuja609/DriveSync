import React, { useState, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SetupLayout from './SetupLayout';
import Button from '../../common/Button';
import { useProfileSetup } from '../../../context/ProfileSetupContext';
import profileService from '../../../services/profileService';

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer not to say', label: 'Prefer not to say' }
];

const SetupPersonalInfo = () => {
    const { currentStep, totalSteps, nextStep } = useProfileSetup();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        gender: '',
        dob: null,
        bio: ''
    });

    // Load data from localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.user) {
            setFormData({
                gender: userData.user.gender || '',
                dob: userData.user.dob ? dayjs(userData.user.dob) : null,
                bio: userData.user.bio || ''
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

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            dob: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formattedData = {
                ...formData,
                dob: formData.dob ? dayjs(formData.dob).format('YYYY-MM-DD') : null
            };
            await profileService.setupPersonalInfo(formattedData);
            nextStep();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save personal information');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SetupLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="Personal Information"
            subtitle="Tell us more about yourself"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                    select
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    variant="outlined"
                    className="bg-background-light/30"
                    sx={{ /* Same styles as other inputs */ }}
                >
                    {genderOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date of Birth"
                        value={formData.dob}
                        onChange={handleDateChange}
                        maxDate={dayjs()}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                className: "bg-background-light/30",
                                sx: {
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
                                }
                            }
                        }}
                    />
                </LocalizationProvider>

                <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    variant="outlined"
                    className="bg-background-light/30"
                    sx={{ /* Same styles as other inputs */ }}
                    placeholder="Tell us about yourself..."
                    helperText="Max 200 characters"
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

export default SetupPersonalInfo; 