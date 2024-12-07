const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes for saved cars
router.get('/saved-cars', protect, userController.getSavedCars);
router.post('/saved-cars', protect, userController.saveCar);
router.delete('/saved-cars/:carId', protect, userController.removeSavedCar);
router.put('/saved-cars/:carId/notes', protect, userController.updateSavedCarNotes);

module.exports = router; 