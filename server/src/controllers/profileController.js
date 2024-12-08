const User = require('../models/User');
const crypto = require('crypto');
const mailService = require('../services/mailService');

const profileController = {
    // Get setup progress
    async getSetupProgress(req, res) {
        try {
            const user = await User.findById(req.user.id);
            
            // Define steps and their completion criteria
            const progress = {
                basicInfo: Boolean(user.name.first && user.name.last && user.phoneNumber),
                profilePicture: user.profilePicture !== 'default-profile.png',
                personalInfo: Boolean(user.gender && user.dob && user.bio),
                address: Boolean(user.address && user.address.street),
                preferences: Boolean(user.preferences && user.preferences.carTypes.length > 0)
            };

            // Calculate current step (first incomplete step)
            const steps = Object.keys(progress);
            const currentStep = steps.findIndex(step => !progress[step]) + 1;

            res.json({
                success: true,
                progress,
                currentStep: currentStep === 0 ? steps.length : currentStep,
                totalSteps: steps.length,
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
            const { firstName, lastName, phoneNumber } = req.body;

            const updates = {
                name: {
                    first: firstName,
                    last: lastName
                },
                phoneNumber
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
            const { profilePicture } = req.body;

            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: { profilePicture } },
                { new: true }
            );

            res.json({
                success: true,
                message: 'Profile picture updated successfully',
                profilePicture: user.profilePicture,
                progress: {
                    currentStep: 2,
                    isComplete: true
                }
            });
        } catch (error) {
            console.error('Setup profile picture error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating profile picture'
            });
        }
    },

    // Update profile picture
    async updateProfilePicture(req, res) {
        try {
            const { profilePicture } = req.body;
            const user = await User.findByIdAndUpdate(req.user.id, { $set: { profilePicture } }, { new: true });
            res.json({ success: true, profilePicture: user.profilePicture });
        } catch (error) {
            console.error('Update profile picture error:', error);
            res.status(500).json({ success: false, message: 'Error updating profile picture' });
        }
    },

    // Step 3: Setup personal information
    async setupPersonalInfo(req, res) {
        try {
            const { gender, dob, bio } = req.body;

            const updates = {
                gender: gender || 'prefer not to say',
                dob,
                bio
            };

            await User.findByIdAndUpdate(
                req.user.id,
                { $set: updates },
                { runValidators: true }
            );

            res.json({
                success: true,
                message: 'Personal information saved successfully',
                progress: {
                    currentStep: 3,
                    isComplete: true
                }
            });
        } catch (error) {
            console.error('Setup personal info error:', error);
            res.status(500).json({
                success: false,
                message: 'Error saving personal information'
            });
        }
    },

    // Step 4: Setup address
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
                    currentStep: 4,
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

    // Step 5: Setup preferences
    async setupPreferences(req, res) {
        try {
            const { carTypes = [], budgetRange = {}, favoriteBrands = [] } = req.body;

            const updates = {
                preferences: {
                    carTypes,
                    budgetRange,
                    favoriteBrands
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
                    currentStep: 5,
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
            const userId = req.user.id; // From auth middleware
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Mark profile as complete
            user.isProfileComplete = true;
            await user.save();

            res.json({
                success: true,
                message: 'Profile setup completed successfully',
                user: {
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    profilePicture: user.profilePicture,
                    gender: user.gender,
                    dob: user.dob,
                    address: user.address,
                    bio: user.bio,
                    preferences: user.preferences,
                    isProfileComplete: true
                }
            });
        } catch (error) {
            console.error('Complete setup error:', error);
            res.status(500).json({
                success: false,
                message: 'Error completing profile setup'
            });
        }
    },

    // Skip current step
    async skipStep(req, res) {
        try {
            const { step } = req.params;
            const user = await User.findById(req.user.id);

            // Mark the step as skipped in user preferences
            if (!user.skippedSteps) {
                user.skippedSteps = [];
            }
            if (!user.skippedSteps.includes(step)) {
                user.skippedSteps.push(step);
            }

            await user.save();

            res.json({
                success: true,
                message: 'Step skipped successfully',
                nextStep: parseInt(step) + 1
            });
        } catch (error) {
            console.error('Skip step error:', error);
            res.status(500).json({
                success: false,
                message: 'Error skipping step'
            });
        }
    },

    // Update profile
    async updateProfile(req, res) {
        try {
            const { name, phoneNumber, bio } = req.body;
            const userId = req.user.id;

            // Find user and update
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        'name.first': name.first,
                        'name.last': name.last,
                        phoneNumber,
                        bio
                    }
                },
                { new: true, runValidators: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    bio: user.bio,
                    profilePicture: user.profilePicture,
                    isVerified: user.isVerified,
                    isProfileComplete: user.isProfileComplete
                }
            });
        } catch (error) {
            console.error('Profile update error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error updating profile'
            });
        }
    },

    // Add new email
    async addEmail(req, res) {
        try {
            const { email } = req.body;
            const userId = req.user.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Generate verification token and add email
            const verificationToken = await user.addEmail(email);

            // Send verification email
            await mailService.sendEmailVerification(email, verificationToken);

            res.json({
                success: true,
                message: 'Verification email sent',
                user: {
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    emails: user.emails,
                    isVerified: user.isVerified
                }
            });
        } catch (error) {
            console.error('Add email error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error adding email'
            });
        }
    },

    // Set primary email
    async setPrimaryEmail(req, res) {
        try {
            const { email } = req.body;
            const userId = req.user.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            await user.setPrimaryEmail(email);

            res.json({
                success: true,
                message: 'Primary email updated',
                user: {
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    emails: user.emails,
                    isVerified: user.isVerified
                }
            });
        } catch (error) {
            console.error('Set primary email error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error setting primary email'
            });
        }
    },

    // Remove email
    async removeEmail(req, res) {
        try {
            const { email } = req.params;
            const userId = req.user.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if trying to remove primary email
            const emailDoc = user.emails.find(e => e.address === email);
            if (emailDoc?.isPrimary) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot remove primary email'
                });
            }

            // Remove email
            user.emails = user.emails.filter(e => e.address !== email);
            await user.save();

            res.json({
                success: true,
                message: 'Email removed successfully',
                user: {
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    emails: user.emails,
                    isVerified: user.isVerified
                }
            });
        } catch (error) {
            console.error('Remove email error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error removing email'
            });
        }
    },

    // Verify additional email
    async verifyAdditionalEmail(req, res) {
        try {
            const { token } = req.params;
            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            const user = await User.findOne({
                'emails.verificationToken': hashedToken,
                'emails.verificationExpires': { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired verification token'
                });
            }

            // Find and verify the email
            const email = user.emails.find(e => e.verificationToken === hashedToken);
            if (email) {
                email.isVerified = true;
                email.verificationToken = undefined;
                email.verificationExpires = undefined;
                await user.save();
            }

            res.json({
                success: true,
                message: 'Email verified successfully',
                user: {
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    emails: user.emails,
                    isVerified: user.isVerified
                }
            });
        } catch (error) {
            console.error('Email verification error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during email verification'
            });
        }
    }
};

module.exports = profileController; 