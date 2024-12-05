import React, { useState, useEffect } from 'react';
import { TextField, Chip, Slider, MenuItem } from '@mui/material';
import SetupLayout from './SetupLayout';
import Button from '../../common/Button';
import { useProfileSetup } from '../../../context/ProfileSetupContext';
import profileService from '../../../services/profileService';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const carTypes = [
    'sedan', 'suv', 'sports', 'luxury', 'electric', 'hybrid'
];

const carBrands = [
    'Tesla', 'BMW', 'Mercedes', 'Audi', 'Porsche', 'Ferrari', 'Lamborghini',
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Volkswagen', 'Hyundai', 'Kia'
];

const SetupPreferences = () => {
    const { currentStep, totalSteps, nextStep } = useProfileSetup();
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        carTypes: [],
        budgetRange: {
            min: 0,
            max: 1000000
        },
        favoriteBrands: []
    });

    // Load preferences from localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.user?.preferences) {
            setFormData({
                carTypes: userData.user.preferences.carTypes || [],
                budgetRange: userData.user.preferences.budgetRange || {
                    min: 0,
                    max: 1000000
                },
                favoriteBrands: userData.user.preferences.favoriteBrands || []
            });
        }
    }, []);

    const handleCarTypeToggle = (type) => {
        setFormData(prev => ({
            ...prev,
            carTypes: prev.carTypes.includes(type)
                ? prev.carTypes.filter(t => t !== type)
                : [...prev.carTypes, type]
        }));
    };

    const handleBrandChange = (e) => {
        setFormData(prev => ({
            ...prev,
            favoriteBrands: Array.isArray(e.target.value) ? e.target.value : []
        }));
    };

    const handleBudgetChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            budgetRange: {
                min: newValue[0],
                max: newValue[1]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Save preferences
            await profileService.setupPreferences(formData);
            
            // Complete setup
            try {
                const response = await profileService.completeSetup();
                if (response.success && response.user) {
                    // Make sure isProfileComplete is included in the user data
                    const userData = {
                        ...response.user,
                        isProfileComplete: true
                    };
                    setUser(userData);

                    // Also update localStorage directly to ensure it's saved
                    const currentStorage = localStorage.getItem('user') ? localStorage : sessionStorage;
                    const currentData = JSON.parse(currentStorage.getItem('user') || '{}');
                    currentStorage.setItem('user', JSON.stringify({
                        ...currentData,
                        user: userData
                    }));
                }
                navigate('/'); // Navigate to home
            } catch (completeError) {
                console.error('Error completing setup:', completeError);
                // Still navigate if preferences were saved
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save preferences');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SetupLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="Your Preferences"
            subtitle="Help us personalize your experience"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <label className="block text-text-primary mb-2">
                        Car Types You're Interested In
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {carTypes.map(type => (
                            <Chip
                                key={type}
                                label={type.charAt(0).toUpperCase() + type.slice(1)}
                                onClick={() => handleCarTypeToggle(type)}
                                color={formData.carTypes.includes(type) ? "primary" : "default"}
                                className="cursor-pointer"
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-text-primary mb-2">
                        Budget Range (USD)
                    </label>
                    <Slider
                        value={[formData.budgetRange?.min || 0, formData.budgetRange?.max || 1000000]}
                        onChange={handleBudgetChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000000}
                        step={10000}
                        valueLabelFormat={value => `$${(value || 0).toLocaleString()}`}
                    />
                    <div className="flex justify-between text-text-primary/70 text-sm">
                        <span>${(formData.budgetRange?.min || 0).toLocaleString()}</span>
                        <span>${(formData.budgetRange?.max || 1000000).toLocaleString()}</span>
                    </div>
                </div>

                <TextField
                    select
                    fullWidth
                    label="Favorite Brands"
                    value={formData.favoriteBrands}
                    onChange={handleBrandChange}
                    SelectProps={{
                        multiple: true,
                        renderValue: (selected) => (
                            <div className="flex flex-wrap gap-1">
                                {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" />
                                ))}
                            </div>
                        ),
                    }}
                    className="bg-background-light/30"
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                        },
                        '& .MuiInputBase-input': {
                            color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'rgb(255, 255, 255)', // Placeholder text color set to white
                        },
                    }}
                >
                    {carBrands.map((brand) => (
                        <MenuItem key={brand} value={brand}>
                            {brand}
                        </MenuItem>
                    ))}
                </TextField>

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
                        className="w-32"
                    >
                        {loading ? 'Finishing...' : 'Complete Setup'}
                    </Button>
                </div>
            </form>
        </SetupLayout>
    );
};

export default SetupPreferences; 