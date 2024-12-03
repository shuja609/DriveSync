const User = require('../models/User');
const mailService = require('../services/mailService');
const { validateRegistration } = require('../utils/validators');
const { generateToken } = require('../config/auth');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Your Google Client ID

const authController = {
    // Register user
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

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
                password
            });

            // Generate email verification token
            const verificationToken = user.createEmailVerificationToken();

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
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error during registration'
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
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    profilePicture: user.profilePicture,
                    gender: user.gender,
                    dob: user.dob,
                    address: user.address,
                    bio: user.bio,
                    preferences: user.preferences,
                    role: user.role,
                    isVerified: user.isVerified,
                    isProfileComplete: user.isProfileComplete,
                    lastLogin: user.lastLogin
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
            console.log('Received token:', token);

            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            const user = await User.findOne({
                emailVerificationToken: hashedToken,
                emailVerificationExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired verification token'
                });
            }

            // Check if already verified
            if (user.isVerified) {
                return res.json({
                    success: true,
                    message: 'Email already verified',
                    token: generateToken(user._id),
                    user: {
                        id: user._id,
                        name: `${user.name.first} ${user.name.last}`,
                        email: user.email,
                        role: user.role,
                        isVerified: true
                    }
                });
            }

            // Update user verification status
            user.isVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();

            // Send welcome email
            await mailService.sendWelcomeEmail(user.email, user.fullName);

            // Generate new token
            const newToken = generateToken(user._id);

            res.json({
                success: true,
                message: 'Email verified successfully',
                token: newToken,
                user: {
                    id: user._id,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    role: user.role,
                    isVerified: true
                }
            });
        } catch (error) {
            console.error('Verification error:', error);
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
    },

    // Google login
    async loginWithGoogle(req, res) {
        const { idToken } = req.body;
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            });
            const payload = ticket.getPayload();
            const email = payload.email;

            // Check if user exists in your database, create if not
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({
                    name: { first: payload.given_name, last: payload.family_name },
                    email,
                    // You can set a default password or handle it differently
                    password: 'defaultPassword', // This should be hashed in a real scenario
                    isVerified: true // Automatically verify users from Google
                });
                await user.save();
            }

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
            console.error('Google login error:', error);
            res.status(400).json({ success: false, message: 'Google login failed' });
        }
    }
};

module.exports = authController; 