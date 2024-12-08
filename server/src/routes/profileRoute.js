const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

// Get setup progress
router.get('/setup-progress', profileController.getSetupProgress);

// Setup steps
router.post('/setup/basic-info', profileController.setupBasicInfo);
router.post('/setup/personal-info', profileController.setupPersonalInfo);
router.post('/setup/profile-picture', profileController.setupProfilePicture);
router.put('/setup/profile-picture', profileController.updateProfilePicture);
router.post('/setup/address', profileController.setupAddress);
router.post('/setup/preferences', profileController.setupPreferences);

// Complete setup
router.post('/setup/complete', profileController.completeSetup);

// Skip step
router.post('/setup/skip/:step', profileController.skipStep);

// Add these routes
router.post('/emails/add', profileController.addEmail);
router.post('/emails/primary', profileController.setPrimaryEmail);
router.delete('/emails/:email', profileController.removeEmail);
router.get('/emails/verify/:token', profileController.verifyAdditionalEmail);

module.exports = router; 