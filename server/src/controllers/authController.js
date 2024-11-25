const User = require('../models/User');
const mailService = require('../services/mailService');
const { validateRegistration } = require('../utils/validators');
const { generateToken } = require('../config/auth');
const crypto = require('crypto');

const authController = {
    // Register user
    async register(req, res) {
        try {
            // Validate registration data
            const { isValid, errors } = validateRegistration(req.body);
            if (!isValid) {
                return res.status(400).json({ success: false, errors });
            }

            const { email, password, name, phoneNumber } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already registered'
                });
            }

            // Create new user
            const user = new User({
                name: {
                    first: name.first,
                    last: name.last
                },
                email,
                password,
                phoneNumber
            });

            // Generate email verification token
            const verificationToken = user.createEmailVerificationToken();
            console.log('Generated Token:', verificationToken);
            console.log('Stored Hashed Token:', user.emailVerificationToken);

            // Save user
            await user.save();

            // Send verification email
            await mailService.sendVerificationEmail(email, verificationToken);

            // Generate JWT token
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                message: 'Registration successful. Please verify your email.',
                token,
                user: {
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                    isVerified: user.isVerified
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during registration'
            });
        }
    },

    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user and include password field
            const user = await User.findOne({ email }).select('+password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check if email is verified
            if (!user.isVerified) {
                return res.status(401).json({
                    success: false,
                    message: 'Please verify your email before logging in'
                });
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Generate JWT token
            const token = generateToken(user._id);

            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login'
            });
        }
    },

    // Verify email
    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
           // console.log('Verification attempt with token:', token);

            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');
           // console.log('Computed hash:', hashedToken);

            // Find user by verification token
            const user = await User.findOne({
                emailVerificationToken: hashedToken,
                emailVerificationExpires: { $gt: Date.now() }
            });
            
            if (!user) {
                // console.log('No user found with token hash:', hashedToken);
                // // Let's also log all users to debug
                // const allUsers = await User.find({}, 'email emailVerificationToken');
                // console.log('All users tokens:', allUsers);
                
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired verification token'
                });
            }

            // console.log('Found user:', {
            //     email: user.email,
            //     tokenMatch: user.emailVerificationToken === hashedToken,
            //     isExpired: user.emailVerificationExpires < Date.now()
            // });

            // Check if already verified
            if (user.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already verified'
                });
            }

            // Update user verification status
            user.isVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();

            // Send welcome email
            await mailService.sendWelcomeEmail(user.email, user.fullName);

            res.json({
                success: true,
                message: 'Email verified successfully'
            });
        } catch (error) {
            console.error('Email verification error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during email verification'
            });
        }
    },

    // Forgot password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'No account found with that email'
                });
            }

            // Generate reset token
            const resetToken = user.createPasswordResetToken();
            await user.save();

            // Send password reset email
            await mailService.sendPasswordResetEmail(email, resetToken);

            res.json({
                success: true,
                message: 'Password reset email sent'
            });
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({
                success: false,
                message: 'Error sending password reset email'
            });
        }
    },

    // Reset password
    async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const user = await User.findOne({
                passwordResetToken: crypto
                    .createHash('sha256')
                    .update(token)
                    .digest('hex'),
                passwordResetExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired reset token'
                });
            }

            // Update password
            user.password = password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            res.json({
                success: true,
                message: 'Password reset successful'
            });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({
                success: false,
                message: 'Error resetting password'
            });
        }
    }
};

module.exports = authController; 