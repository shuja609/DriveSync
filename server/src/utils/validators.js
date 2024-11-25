/**
 * Collection of validation utility functions
 */

// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (min 8 chars, at least one number, one uppercase, one lowercase)
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
};

// Phone number validation (international format)
const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
};

// Username validation (3-20 chars, letters, numbers, underscore, hyphen)
const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
};

// URL validation
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

// Object to validate user registration input
const validateRegistration = (userData) => {
    const errors = {};

    if (!userData.email || !isValidEmail(userData.email)) {
        errors.email = 'Please provide a valid email address';
    }

    if (!userData.password || !isValidPassword(userData.password)) {
        errors.password = 'Password must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character';
    }

    if (userData.phone && !isValidPhone(userData.phone)) {
        errors.phone = 'Please provide a valid phone number';
    }

    if (!userData.username || !isValidUsername(userData.username)) {
        errors.username = 'Username must be 3-20 characters long and can only contain letters, numbers, underscore, and hyphen';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validate update profile input
const validateProfileUpdate = (updateData) => {
    const errors = {};

    if (updateData.email && !isValidEmail(updateData.email)) {
        errors.email = 'Please provide a valid email address';
    }

    if (updateData.phone && !isValidPhone(updateData.phone)) {
        errors.phone = 'Please provide a valid phone number';
    }

    if (updateData.website && !isValidUrl(updateData.website)) {
        errors.website = 'Please provide a valid URL';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Sanitize user input (remove HTML tags and trim)
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .replace(/(<([^>]+)>)/gi, '') // Remove HTML tags
        .trim();
};

// Validate ObjectId
const isValidObjectId = (id) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
};

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidPhone,
    isValidUsername,
    isValidUrl,
    isValidObjectId,
    validateRegistration,
    validateProfileUpdate,
    sanitizeInput
}; 