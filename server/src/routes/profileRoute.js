const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes require authentication
router.use(protect);

/**
 * Profile Setup Steps:
 * 1. Basic Info (Name, Phone, Gender, DOB)
 * 2. Profile Picture
 * 3. Address Details
 * 4. Car Preferences
 */

// Get profile setup progress
router.get('/setup-progress', profileController.getSetupProgress);

// Step 1: Basic Information
router.post('/setup/basic-info', profileController.setupBasicInfo);

// Step 2: Profile Picture
router.post('/setup/profile-picture',
    upload.single('profilePicture'),
    profileController.setupProfilePicture
);

// Step 3: Address Details
router.post('/setup/address', profileController.setupAddress);

// Step 4: Car Preferences
router.post('/setup/preferences', profileController.setupPreferences);

// Mark profile setup as complete
router.post('/setup/complete', profileController.completeSetup);

// Regular profile routes
router.get('/', profileController.getProfile);
// router.put('/update', profileController.updateProfile);
// router.put('/picture', upload.single('profilePicture'), profileController.updateProfilePicture);
// router.delete('/picture', profileController.deleteProfilePicture);
// router.put('/preferences', profileController.updatePreferences);

module.exports = router; 