const mailService = require('../services/mailService');

// In your registration controller
await mailService.sendVerificationEmail(user.email, verificationToken);

// In your password reset controller
await mailService.sendPasswordResetEmail(user.email, resetToken);

// After email verification
await mailService.sendWelcomeEmail(user.email, user.name);