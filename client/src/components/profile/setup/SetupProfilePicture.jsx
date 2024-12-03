import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudUpload } from '@mui/icons-material';
import SetupLayout from './SetupLayout';
import Button from '../../common/Button';
import { useProfileSetup } from '../../../context/ProfileSetupContext';
import profileService from '../../../services/profileService';
import { uploadToCloudinary } from '../../../config/cloudinary';

const SetupProfilePicture = () => {
    const { currentStep, totalSteps, nextStep } = useProfileSetup();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // Load profile picture from localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.user?.profilePicture && userData.user.profilePicture !== 'default-profile.png') {
            setImagePreview(userData.user.profilePicture);
        }
    }, []);

    const validateFile = (file) => {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size must be less than 5MB');
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            validateFile(file);
            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile && !imagePreview) {
            nextStep();
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Upload to Cloudinary
            const imageUrl = await uploadToCloudinary(imageFile);

            // Save URL to backend
            await profileService.setupProfilePicture(imageUrl);
            nextStep();
        } catch (err) {
            setError(err.message || 'Failed to upload profile picture');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SetupLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="Add a Profile Picture"
            subtitle="Help others recognize you"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-background-light/30 flex items-center justify-center relative group">
                        {imagePreview ? (
                            <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <CloudUpload className="w-12 h-12 text-text-primary/50" />
                        )}
                        
                        {loading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="profile-picture-input"
                    />
                    
                    <div>
                        <label htmlFor="profile-picture-input">
                            <div
                                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-dark hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                                role="button"
                                tabIndex={0}
                            >
                                {imagePreview ? 'Change Picture' : 'Choose Picture'}
                            </div>
                        </label>
                    </div>

                    {imagePreview && (
                        <p className="text-sm text-white">
                            Click 'Next' to save your profile picture
                        </p>
                    )}
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center text-white">
                        {error}
                    </div>
                )}

                <div className="flex justify-between pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => nextStep()}
                        className="w-24"
                        disabled={loading}
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

export default SetupProfilePicture; 