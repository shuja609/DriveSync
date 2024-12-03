const nodemailer = require('nodemailer');
const keys = require('../config/keys');
const crypto = require('crypto');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            // Using environment variables for email configuration
            service: keys.email.service, // 'gmail' or 'SendGrid'
            auth: {
                user: keys.email.user,
                pass: keys.email.password // App specific password for Gmail or API key for SendGrid
            }
        });
    }

    // Send verification email
    async sendVerificationEmail(userEmail, verificationToken) {
        // We're receiving the raw token, so we need to hash it for the URL
        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        
        // Use the raw token in the URL
        const verificationUrl = `${keys.app.frontendUrl}/verify-email?token=${verificationToken}`;
        
        const mailOptions = {
            from: keys.email.from,
            to: userEmail,
            subject: 'Verify Your Email Address',
            html: `
                <h1>Email Verification</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationUrl}" style="
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                    margin: 20px 0;">
                    Verify Email
                </a>
                <p>If you didn't create an account, please ignore this email.</p>
                <p>This link will expire in 24 hours.</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }

    // Send password reset email
    async sendPasswordResetEmail(userEmail, resetToken) {
        const resetUrl = `${keys.app.frontendUrl}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: keys.email.from,
            to: userEmail,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset</h1>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}" style="
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                    margin: 20px 0;">
                    Reset Password
                </a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }

    // Send welcome email
    async sendWelcomeEmail(userEmail, userName) {
        const mailOptions = {
            from: keys.email.from,
            to: userEmail,
            subject: 'Welcome to Our Platform!',
            html: `
                <h1>Welcome ${userName}!</h1>
                <p>Thank you for joining our platform. We're excited to have you on board!</p>
                <p>If you have any questions, feel free to reply to this email.</p>
                <p>Best regards,<br>Your Team</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }
}

module.exports = new MailService(); 