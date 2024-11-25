const User = require('../models/User');
const { validateProfileUpdate } = require('../utils/validators');
const { uploadToCloudinary, removeFromCloudinary } = require('../utils/cloudinary');

const profileController = {
    // Get setup progress
    async getSetupProgress(req, res) {
        try {
            const user = await User.findById(req.user.id);
            
            const progress = {
                basicInfo: Boolean(user.name.first && user.name.last && user.phoneNumber),
                profilePicture: user.profilePicture !== 'default-profile.png',
                address: Boolean(user.address && user.address.street),
                preferences: Boolean(user.preferences && user.preferences.carTypes.length > 0)
            };

            const currentStep = Object.values(progress).filter(Boolean).length + 1;

            res.json({
                success: true,
                progress,
                currentStep,
                totalSteps: 4,
                isComplete: user.isProfileComplete
            });
        } catch (error) {
            console.error('Get setup progress error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching setup progress'
            });
        }
    },

    // Step 1: Setup basic information
    async setupBasicInfo(req, res) {
        try {
            const { firstName, lastName, phoneNumber, gender, dob } = req.body;

            const updates = {
                name: {
                    first: firstName,
                    last: lastName
                },
                phoneNumber,
                gender,
                dob
            };

            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: updates },
                { new: true, runValidators: true }
            );

            res.json({
                success: true,
                message: 'Basic information saved successfully',
                progress: {
                    currentStep: 1,
                    isComplete: true
                }
            });
        } catch (error) {
            console.error('Setup basic info error:', error);
            res.status(500).json({
                success: false,
                message: 'Error saving basic information'
            });
        }
    },

    // Step 2: Setup profile picture
    async setupProfilePicture(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No image file provided'
                });
            }

            const user = await User.findById(req.user.id);

            if (user.profilePicture && user.profilePicture !== 'default-profile.png') {
                await removeFromCloudinary(user.profilePicture);
            }

            const result = await uploadToCloudinary(req.file.path, 'profile-pictures');
            user.profilePicture = result.secure_url;
            await user.save();

            res.json({
                success: true,
                message: 'Profile picture uploaded successfully',
                profilePicture: result.secure_url,
                progress: {
                    currentStep: 2,
                    isComplete: true
                }
            });
        } catch (error) {
            console.error('Setup profile picture error:', error);
            res.status(500).json({
                success: false,
                message: 'Error uploading profile picture'
            });
        }
    },

    // Step 3: Setup address
    async setupAddress(req, res) {
        try {
            const { street, city, state, zipCode, country } = req.body;

            const updates = {
                address: {
                    street,
                    city,
                    state,
                    zipCode,
                    country
                }
            };

            await User.findByIdAndUpdate(
                req.user.id,
                { $set: updates },
                { runValidators: true }
            );

            res.json({
                success: true,
                message: 'Address saved successfully',
                progress: {
                    currentStep: 3,
                    isComplete: true
                }
            });
        } catch (error) {
            console.error('Setup address error:', error);
            res.status(500).json({
                success: false,
                message: 'Error saving address'
            });
        }
    },

    // Step 4: Setup preferences
    async setupPreferences(req, res) {
        try {
            const { carTypes, budgetRange, favoriteBrands } = req.body;

            if (!Array.isArray(carTypes) || carTypes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please select at least one car type'
                });
            }

            if (!budgetRange || !budgetRange.min || !budgetRange.max || 
                budgetRange.min > budgetRange.max) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid budget range'
                });
            }

            const updates = {
                preferences: {
                    carTypes,
                    budgetRange,
                    favoriteBrands: favoriteBrands || []
                }
            };

            await User.findByIdAndUpdate(
                req.user.id,
                { $set: updates },
                { runValidators: true }
            );

            res.json({
                success: true,
                message: 'Preferences saved successfully',
                progress: {
                    currentStep: 4,
                    isComplete: true
                }
            });
        } catch (error) {
            console.error('Setup preferences error:', error);
            res.status(500).json({
                success: false,
                message: 'Error saving preferences'
            });
        }
    },

    // Complete setup
    async completeSetup(req, res) {
        try {
            const user = await User.findById(req.user.id);

            // Verify all steps are completed
            if (!user.name.first || !user.name.last || !user.phoneNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Please complete basic information first'
                });
            }

            if (!user.address || !user.address.street) {
                return res.status(400).json({
                    success: false,
                    message: 'Please complete address information'
                });
            }

            if (!user.preferences || !user.preferences.carTypes.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Please complete preferences'
                });
            }

            user.isProfileComplete = true;
            await user.save();

            res.json({
                success: true,
                message: 'Profile setup completed successfully',
                redirectUrl: '/dashboard'
            });
        } catch (error) {
            console.error('Complete setup error:', error);
            res.status(500).json({
                success: false,
                message: 'Error completing profile setup'
            });
        }
    },

    // Get profile
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id)
                .select('-password -passwordResetToken -passwordResetExpires');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                profile: user
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching profile'
            });
        }
    }
};

module.exports = profileController; 