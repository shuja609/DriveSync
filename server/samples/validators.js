const { 
    validateRegistration, 
    validateProfileUpdate, 
    sanitizeInput 
} = require('../utils/validators');

// In your registration controller
const validateUser = (req, res, next) => {
    const { isValid, errors } = validateRegistration(req.body);
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }
    next();
};

// In your update profile controller
const validateUpdate = (req, res, next) => {
    const { isValid, errors } = validateProfileUpdate(req.body);
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }
    // Sanitize inputs
    req.body.bio = sanitizeInput(req.body.bio);
    next();
};