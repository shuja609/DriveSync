const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const accountController = require('../controllers/accountController');
const { body } = require('express-validator');

// Validation middleware
const validatePersonalInfo = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('phoneNumber').optional().matches(/^\+?[\d\s-]+$/).withMessage('Invalid phone number format'),
    body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
    body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say']).withMessage('Invalid gender value')
];

const validateAddress = [
    body('street').optional().trim(),
    body('city').optional().trim(),
    body('state').optional().trim(),
    body('zipCode').optional().trim(),
    body('country').optional().trim()
];

const validatePreferences = [
    body('language').optional().isIn(['en', 'es', 'fr', 'de']).withMessage('Invalid language'),
    body('currency').optional().isIn(['USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
    body('notifications.email').optional().isBoolean(),
    body('notifications.sms').optional().isBoolean(),
    body('notifications.marketing').optional().isBoolean()
];

// Protected routes
router.use(protect);

// Get account settings
router.get('/', accountController.getAccountSettings);

// Update personal information
router.put('/personal-info', validatePersonalInfo, accountController.updatePersonalInfo);

// Update address
router.put('/address', validateAddress, accountController.updateAddress);

// Update preferences
router.put('/preferences', validatePreferences, accountController.updatePreferences);

module.exports = router; 