// const express = require('express');
// const router = express.Router();
// const { hashPassword, generateToken } = require('../config/auth');
// const User = require('../models/User');
// const mailService = require('../services/mailService');
// const { validateRegistration } = require('../utils/validators');
// const { protect } = require('../middleware/authMiddleware');

// /**
//  * @route   POST /api/auth/register
//  * @desc    Register a new user
//  * @access  Public
//  */
// router.post('/register', async (req, res) => {
//     try {
//         // Validate registration data
//         const { isValid, errors } = validateRegistration(req.body);
//         if (!isValid) {
//             return res.status(400).json({ success: false, errors });
//         }

//         const { email, password, name, phoneNumber } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email is already registered'
//             });
//         }

//         // Create new user
//         const user = new User({
//             name: {
//                 first: name.first,
//                 last: name.last
//             },
//             email,
//             password,
//             phoneNumber
//         });

//         // Generate email verification token
//         const verificationToken = user.createEmailVerificationToken();

//         // Save user
//         await user.save();

//         // Send verification email
//         await mailService.sendVerificationEmail(email, verificationToken);

//         // Generate JWT token
//         const token = generateToken(user._id);

//         res.status(201).json({
//             success: true,
//             message: 'Registration successful. Please verify your email.',
//             token,
//             user: {
//                 id: user._id,
//                 name: user.fullName,
//                 email: user.email,
//                 isVerified: user.isVerified
//             }
//         });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error during registration'
//         });
//     }
// });

// /**
//  * @route   POST /api/auth/login
//  * @desc    Authenticate user & get token
//  * @access  Public
//  */
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Find user and include password field
//         const user = await User.findOne({ email }).select('+password');
        
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid email or password'
//             });
//         }

//         // Check password
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid email or password'
//             });
//         }

//         // Check if email is verified
//         if (!user.isVerified) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Please verify your email before logging in'
//             });
//         }

//         // Update last login
//         user.lastLogin = new Date();
//         await user.save();

//         // Generate JWT token
//         const token = generateToken(user._id);

//         res.json({
//             success: true,
//             token,
//             user: {
//                 id: user._id,
//                 name: user.fullName,
//                 email: user.email,
//                 role: user.role,
//                 isVerified: user.isVerified
//             }
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error during login'
//         });
//     }
// });

// /**
//  * @route   GET /api/auth/verify-email/:token
//  * @desc    Verify user's email address
//  * @access  Public
//  */
// router.get('/verify-email/:token', async (req, res) => {
//     try {
//         const { token } = req.params;

//         // Find user by verification token
//         const user = await User.findOne({
//             emailVerificationToken: crypto
//                 .createHash('sha256')
//                 .update(token)
//                 .digest('hex'),
//             emailVerificationExpires: { $gt: Date.now() }
//         });

//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid or expired verification token'
//             });
//         }

//         // Update user verification status
//         user.isVerified = true;
//         user.emailVerificationToken = undefined;
//         user.emailVerificationExpires = undefined;
//         await user.save();

//         // Send welcome email
//         await mailService.sendWelcomeEmail(user.email, user.fullName);

//         res.json({
//             success: true,
//             message: 'Email verified successfully'
//         });
//     } catch (error) {
//         console.error('Email verification error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error during email verification'
//         });
//     }
// });

// /**
//  * @route   POST /api/auth/forgot-password
//  * @desc    Send password reset email
//  * @access  Public
//  */
// router.post('/forgot-password', async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No account found with that email'
//             });
//         }

//         // Generate reset token
//         const resetToken = user.createPasswordResetToken();
//         await user.save();

//         // Send password reset email
//         await mailService.sendPasswordResetEmail(email, resetToken);

//         res.json({
//             success: true,
//             message: 'Password reset email sent'
//         });
//     } catch (error) {
//         console.error('Forgot password error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error sending password reset email'
//         });
//     }
// });

// /**
//  * @route   POST /api/auth/reset-password/:token
//  * @desc    Reset password
//  * @access  Public
//  */
// router.post('/reset-password/:token', async (req, res) => {
//     try {
//         const { token } = req.params;
//         const { password } = req.body;

//         const user = await User.findOne({
//             passwordResetToken: crypto
//                 .createHash('sha256')
//                 .update(token)
//                 .digest('hex'),
//             passwordResetExpires: { $gt: Date.now() }
//         });

//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid or expired reset token'
//             });
//         }

//         // Update password
//         user.password = password;
//         user.passwordResetToken = undefined;
//         user.passwordResetExpires = undefined;
//         await user.save();

//         res.json({
//             success: true,
//             message: 'Password reset successful'
//         });
//     } catch (error) {
//         console.error('Reset password error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error resetting password'
//         });
//     }
// });

// module.exports = router; 